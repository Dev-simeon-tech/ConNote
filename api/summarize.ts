import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IncomingForm } from "formidable";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import axios from "axios";
import isTextExtractablePDF from "../src/utils/isTextExtractablePdf";
import extractTextWithOCR from "../src/utils/extractTextWithOCR";
// Disable bodyParser so formidable can handle it

export const config = {
  api: { bodyParser: false },
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const OCR_API_KEY = process.env.OCR_SPACE_API_KEY;

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

  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "Failed to parse upload" });
    }

    const file = files.file as any;
    const filePath = file[0].filepath || file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "File not found on server" });
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const isTextBased = await isTextExtractablePDF(fileBuffer);

      let summary: string;

      if (isTextBased) {
        // 🔹 Text-based PDF: Use Assistant API with file upload
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
        // 🔸 Image-based PDF: Use OCR first, then send raw text to OpenAI
        const extractedText = await extractTextWithOCR(filePath, OCR_API_KEY);
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

      fs.unlinkSync(filePath);
      res.status(200).json({ summary });
    } catch (error: any) {
      console.error(
        "Summarization error:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Summarization failed" });
    }
  });
}
