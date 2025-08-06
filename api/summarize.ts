import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IncomingForm } from "formidable";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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

const openaiHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  if (!OPENAI_API_KEY || !ASSISTANT_ID || !OCR_API_KEY) {
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

    // Get file from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    });

    const s3Response = await s3Client.send(getObjectCommand);
    const fileBuffer = await streamToBuffer(s3Response.Body as any);

    // Create temporary file for processing
    const tempFilePath = `${os.tmpdir()}/${Date.now()}-${fileKey
      .split("/")
      .pop()}`;
    fs.writeFileSync(tempFilePath, fileBuffer);

    try {
      const summary = await processFile(tempFilePath, fileBuffer);

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
    res.status(500).json({ error: "Failed to process S3 file" });
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
      const summary = await processFile(filePath, fileBuffer);

      fs.unlinkSync(filePath);
      res.status(200).json({ summary });
    } catch (error: any) {
      console.error("Direct upload error:", error);
      res.status(500).json({ error: "Summarization failed" });
    }
  });
}

// Shared file processing logic
async function processFile(
  filePath: string,
  fileBuffer: Buffer
): Promise<string> {
  const isTextBased = await isTextExtractablePDF(fileBuffer);
  let summary: string;

  if (isTextBased) {
    // Text-based PDF: Use Assistant API
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
        content: "Please summarize the uploaded file.",
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
    while (status === "in_progress" || status === "queued") {
      await new Promise((r) => setTimeout(r, 2000));
      const runCheck = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        { headers: openaiHeaders }
      );
      status = runCheck.data.status;
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
    // Image-based PDF: Use OCR
    const extractedText = await extractTextWithOCR(filePath, OCR_API_KEY!);
    if (!extractedText) {
      throw new Error("OCR failed to extract any text.");
    }

    const completionRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Please summarize the following extracted text from a scanned PDF:\n\n${extractedText}`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    summary =
      completionRes.data.choices?.[0]?.message?.content ||
      "No summary generated.";
  }

  return summary;
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
