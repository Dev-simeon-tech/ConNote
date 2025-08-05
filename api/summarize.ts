import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IncomingForm } from "formidable";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import axios from "axios";
import pdfParse from "pdf-parse";

// Allow large files (up to 20MB)
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "20mb",
  },
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID!;
const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY!;

const openaiHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ error: "File upload failed." });
    }

    const file = files.file as any;
    const filePath = file[0]?.filepath || file.path;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: "No file found." });
    }

    try {
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);

      const isExtractable = pdfData.text.trim().length > 30;

      let textContent = "";

      if (isExtractable) {
        // Use OpenAI Assistants API
        const fileForm = new FormData();
        fileForm.append("file", fs.createReadStream(filePath));
        fileForm.append("purpose", "assistants");

        const fileUploadRes = await axios.post(
          "https://api.openai.com/v1/files",
          fileForm,
          {
            headers: { ...fileForm.getHeaders(), ...openaiHeaders },
          }
        );

        const fileId = fileUploadRes.data.id;

        const threadRes = await axios.post(
          "https://api.openai.com/v1/threads",
          {},
          {
            headers: openaiHeaders,
          }
        );

        const threadId = threadRes.data.id;

        await axios.post(
          `https://api.openai.com/v1/threads/${threadId}/messages`,
          {
            role: "user",
            content:
              "Please summarize the uploaded file clearly and concisely.",
          },
          { headers: openaiHeaders }
        );

        const runRes = await axios.post(
          `https://api.openai.com/v1/threads/${threadId}/runs`,
          {
            assistant_id: OPENAI_ASSISTANT_ID,
            tool_resources: {
              code_interpreter: {
                file_ids: [fileId],
              },
            },
          },
          { headers: openaiHeaders }
        );

        const runId = runRes.data.id;

        // Poll for run completion
        let status = "in_progress";
        while (status === "in_progress" || status === "queued") {
          await new Promise((r) => setTimeout(r, 2000));
          const checkRes = await axios.get(
            `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
            { headers: openaiHeaders }
          );
          status = checkRes.data.status;
        }

        const messagesRes = await axios.get(
          `https://api.openai.com/v1/threads/${threadId}/messages`,
          { headers: openaiHeaders }
        );

        const assistantMessage = messagesRes.data.data.find(
          (msg: any) => msg.role === "assistant"
        );
        textContent =
          assistantMessage?.content?.[0]?.text?.value || "No summary found.";
      } else {
        // Fallback to OCR
        const ocrForm = new FormData();
        ocrForm.append("apikey", OCR_SPACE_API_KEY);
        ocrForm.append("file", fs.createReadStream(filePath));
        ocrForm.append("OCREngine", "2");

        const ocrRes = await axios.post(
          "https://api.ocr.space/parse/image",
          ocrForm,
          {
            headers: ocrForm.getHeaders(),
          }
        );

        const parsedText = ocrRes.data?.ParsedResults?.[0]?.ParsedText;
        if (!parsedText) {
          throw new Error("OCR failed to extract text.");
        }

        // Send OCR'd text to OpenAI for summarization
        const summaryRes = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that summarizes scanned PDF content.",
              },
              {
                role: "user",
                content: `Summarize the following text from a scanned document:\n\n${parsedText}`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        textContent = summaryRes.data.choices[0].message.content;
      }

      fs.unlinkSync(filePath);
      res.status(200).json({ summary: textContent });
    } catch (error: any) {
      console.error("Summary error:", error.response?.data || error.message);
      fs.existsSync(filePath) && fs.unlinkSync(filePath);
      res.status(500).json({ error: "Failed to summarize the file." });
    }
  });
}
