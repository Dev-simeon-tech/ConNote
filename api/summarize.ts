import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IncomingForm } from "formidable";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  TextractClient,
  DetectDocumentTextCommand,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import axios from "axios";
import isTextExtractablePDF from "../src/utils/isTextExtractablePdf";
import extractTextWithOCR from "../src/utils/extractTextWithOCR";

export const config = {
  api: { bodyParser: false },
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const OCR_API_KEY = process.env.OCR_SPACE_API_KEY;

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const textractClient = new TextractClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const openaiHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  if (!OPENAI_API_KEY || !ASSISTANT_ID) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  // Check if this is an S3 file processing request
  const contentType = req.headers["content-type"];
  if (contentType?.includes("application/json")) {
    return handleS3FileProcessing(req, res);
  }

  // Handle direct file upload (existing logic for smaller files)
  return handleDirectUpload(req, res);
}

// Handle S3 file processing
async function handleS3FileProcessing(req: VercelRequest, res: VercelResponse) {
  try {
    const { fileKey } = req.body;

    if (!fileKey) {
      return res.status(400).json({ error: "File key is required" });
    }

    console.log(`Processing S3 file: ${fileKey}`);

    // Get file from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    });

    const s3Response = await s3Client.send(getObjectCommand);
    const fileBuffer = await streamToBuffer(s3Response.Body as any);

    console.log(`File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    // Create temporary file for processing
    const tempFilePath = `${os.tmpdir()}/${Date.now()}-${fileKey
      .split("/")
      .pop()}`;
    fs.writeFileSync(tempFilePath, fileBuffer);

    try {
      const summary = await processFileWithTextract(
        tempFilePath,
        fileBuffer,
        fileKey
      );

      // Clean up
      fs.unlinkSync(tempFilePath);

      // Optionally delete from S3 after processing
      if (process.env.DELETE_AFTER_PROCESSING === "true") {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileKey,
          })
        );
      }

      res.status(200).json({ summary });
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw error;
    }
  } catch (error: any) {
    console.error("S3 file processing error:", error);
    res.status(500).json({
      error: "Failed to process S3 file",
      details: error.message,
    });
  }
}

// Handle direct upload (your existing logic)
async function handleDirectUpload(req: VercelRequest, res: VercelResponse) {
  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
    maxFileSize: 4.5 * 1024 * 1024, // 4.5MB limit
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "Failed to parse upload" });
    }

    const file = files.file as any;
    const filePath = file[0]?.filepath || file?.path;

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "File not found on server" });
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const summary = await processFileWithTextract(filePath, fileBuffer);

      fs.unlinkSync(filePath);
      res.status(200).json({ summary });
    } catch (error: any) {
      console.error("Direct upload error:", error);
      res.status(500).json({
        error: "Summarization failed",
        details: error.message,
      });
    }
  });
}

// Enhanced file processing with AWS Textract
async function processFileWithTextract(
  filePath: string,
  fileBuffer: Buffer,
  s3Key?: string
): Promise<string> {
  console.log("Starting file processing...");

  const isTextBased = await isTextExtractablePDF(fileBuffer);
  let summary: string;

  if (isTextBased) {
    console.log("Processing text-based PDF with OpenAI Assistant API...");
    // Text-based PDF: Use Assistant API (your existing logic)
    const uploadForm = new FormData();
    uploadForm.append("file", fs.createReadStream(filePath));
    uploadForm.append("purpose", "assistants");

    const uploadRes = await axios.post(
      "https://api.openai.com/v1/files",
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          ...openaiHeaders,
        },
      }
    );

    const fileId = uploadRes.data.id;

    const threadRes = await axios.post(
      "https://api.openai.com/v1/threads",
      {},
      { headers: openaiHeaders }
    );
    const threadId = threadRes.data.id;

    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: "user",
        content:
          "Please provide a comprehensive summary of the uploaded document, highlighting the key points, main topics, and important details.",
      },
      { headers: openaiHeaders }
    );

    const runRes = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        assistant_id: ASSISTANT_ID,
        tool_resources: {
          code_interpreter: {
            file_ids: [fileId],
          },
        },
      },
      { headers: openaiHeaders }
    );

    let status = "in_progress";
    let runId = runRes.data.id;
    let attempts = 0;
    const maxAttempts = 30; // 1 minute timeout

    while (
      (status === "in_progress" || status === "queued") &&
      attempts < maxAttempts
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      const runCheck = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        { headers: openaiHeaders }
      );
      status = runCheck.data.status;
      attempts++;
    }

    if (status !== "completed") {
      throw new Error(
        `OpenAI Assistant processing failed with status: ${status}`
      );
    }

    const messagesRes = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { headers: openaiHeaders }
    );

    const assistantMessage = messagesRes.data.data.find(
      (msg: any) => msg.role === "assistant"
    );
    summary =
      assistantMessage?.content?.[0]?.text?.value || "No summary found.";
  } else {
    console.log("Processing image-based PDF with AWS Textract...");
    // Image-based PDF: Use AWS Textract
    let extractedText: string;

    try {
      extractedText = await extractTextWithTextract(fileBuffer, s3Key);
      console.log(`Textract extracted ${extractedText.length} characters`);
    } catch (textractError: any) {
      console.log(`Textract failed: ${textractError.message}`);

      // Fallback to OCR.space if available
      if (OCR_API_KEY) {
        console.log("Falling back to OCR.space...");
        try {
          const fileSizeMB = fileBuffer.length / (1024 * 1024);
          if (fileSizeMB > 1) {
            throw new Error(
              `File too large for OCR.space free plan: ${fileSizeMB.toFixed(
                2
              )}MB (max 1MB)`
            );
          }
          extractedText = await extractTextWithOCR(filePath, OCR_API_KEY);
          if (!extractedText) {
            throw new Error("OCR.space failed to extract any text.");
          }
        } catch (ocrError: any) {
          throw new Error(
            `Both Textract and OCR.space failed. Textract: ${textractError.message}. OCR.space: ${ocrError.message}`
          );
        }
      } else {
        throw textractError;
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error(
        "No text could be extracted from the document. The file may contain only images or be corrupted."
      );
    }

    // Truncate text if too long (OpenAI API has token limits)
    const maxLength = 50000; // Roughly 12,500 tokens for GPT-4
    const truncatedText =
      extractedText.length > maxLength
        ? extractedText.substring(0, maxLength) +
          "\n\n[Text truncated due to length...]"
        : extractedText;

    console.log("Sending extracted text to OpenAI for summarization...");

    const completionRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that creates comprehensive summaries of documents. Focus on extracting key points, main topics, important details, and actionable insights.",
          },
          {
            role: "user",
            content: `Please provide a comprehensive summary of the following extracted text from a document:\n\n${truncatedText}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    summary =
      completionRes.data.choices?.[0]?.message?.content ||
      "No summary generated.";
  }

  console.log("File processing completed successfully");
  return summary;
}

// AWS Textract implementation
async function extractTextWithTextract(
  fileBuffer: Buffer,
  s3Key?: string
): Promise<string> {
  const fileSizeInMB = fileBuffer.length / (1024 * 1024);
  console.log(`Using Textract for file of size: ${fileSizeInMB.toFixed(2)}MB`);

  try {
    // For files smaller than 10MB, use synchronous detection
    if (fileSizeInMB < 10) {
      console.log("Using synchronous Textract detection...");

      const command = new DetectDocumentTextCommand({
        Document: {
          Bytes: fileBuffer,
        },
      });

      const response = await textractClient.send(command);

      if (!response.Blocks || response.Blocks.length === 0) {
        throw new Error("No text blocks detected in document");
      }

      // Extract text from LINE blocks (more organized than WORD blocks)
      const textBlocks = response.Blocks.filter(
        (block) => block.BlockType === "LINE" && block.Text
      )
        .map((block) => block.Text!)
        .filter((text) => text.trim().length > 0);

      if (textBlocks.length === 0) {
        throw new Error("No readable text lines found in document");
      }

      const extractedText = textBlocks.join("\n");
      console.log(
        `Extracted ${extractedText.length} characters from ${textBlocks.length} lines`
      );
      return extractedText;
    } else if (s3Key) {
      // For larger files, use asynchronous detection (requires S3)
      console.log("Using asynchronous Textract detection...");

      const startCommand = new StartDocumentTextDetectionCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Name: s3Key,
          },
        },
      });

      const startResponse = await textractClient.send(startCommand);
      const jobId = startResponse.JobId!;

      // Poll for completion
      let jobStatus = "IN_PROGRESS";
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes timeout

      while (jobStatus === "IN_PROGRESS" && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const getCommand = new GetDocumentTextDetectionCommand({
          JobId: jobId,
        });
        const getResponse = await textractClient.send(getCommand);
        jobStatus = getResponse.JobStatus!;
        attempts++;

        if (jobStatus === "SUCCEEDED") {
          const textBlocks =
            getResponse.Blocks?.filter(
              (block) => block.BlockType === "LINE" && block.Text
            )
              ?.map((block) => block.Text!)
              ?.filter((text) => text.trim().length > 0) || [];

          if (textBlocks.length === 0) {
            throw new Error("No readable text found in document");
          }

          return textBlocks.join("\n");
        } else if (jobStatus === "FAILED") {
          throw new Error(
            `Textract job failed: ${
              getResponse.StatusMessage || "Unknown error"
            }`
          );
        }
      }

      if (jobStatus === "IN_PROGRESS") {
        throw new Error("Textract job timed out");
      }
    } else {
      throw new Error(
        "File too large for synchronous processing and no S3 key provided for asynchronous processing"
      );
    }
  } catch (error: any) {
    console.error("Textract error:", error);

    // Handle specific AWS errors
    if (error.name === "InvalidParameterException") {
      throw new Error(
        "Document format not supported by Textract. Please ensure it's a valid PDF or image file."
      );
    } else if (error.name === "DocumentTooLargeException") {
      throw new Error("Document is too large for Textract processing.");
    } else if (error.name === "UnsupportedDocumentException") {
      throw new Error("Document type not supported by Textract.");
    } else if (error.name === "AccessDeniedException") {
      throw new Error("AWS credentials don't have permission to use Textract.");
    } else {
      throw new Error(`Textract processing failed: ${error.message}`);
    }
  }

  throw new Error("Unexpected error in Textract processing");
}

// Helper function to convert stream to buffer (unchanged)
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
