import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import os from "os";
import axios from "axios";

// Disable bodyParser so formidable can handle it
export const config = {
  api: { bodyParser: false },
};
const { IncomingForm } = await import("formidable");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

const openaiHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  if (!OPENAI_API_KEY || !ASSISTANT_ID) {
    return res.status(500).json({ error: "Missing OpenAI credentials" });
  }
  const FormData = (await import("form-data")).default;

  const form = new IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Formidable error:", err);
      return res.status(500).json({ error: "Failed to parse upload" });
    }

    const file = files.file as any;
    const filePath = file[0].filepath || file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "File not found on server" });
    }

    try {
      // Step 1: Upload file to OpenAI
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

      // Step 2: Create thread
      const threadRes = await axios.post(
        "https://api.openai.com/v1/threads",
        {},
        { headers: openaiHeaders }
      );
      const threadId = threadRes.data.id;

      // Step 3: Send a message to thread
      await axios.post(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        {
          role: "user",
          content: "Please summarize the uploaded file.",
        },
        { headers: openaiHeaders }
      );

      // Step 4: Run assistant with file access
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
      const runId = runRes.data.id;

      // Step 5: Poll until run completes
      let status = "in_progress";
      while (status === "in_progress" || status === "queued") {
        await new Promise((r) => setTimeout(r, 2000));
        const runCheck = await axios.get(
          `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
          { headers: openaiHeaders }
        );
        status = runCheck.data.status;
      }

      // Step 6: Fetch messages
      const messagesRes = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        { headers: openaiHeaders }
      );

      const assistantMessage = messagesRes.data.data.find(
        (msg: any) => msg.role === "assistant"
      );
      const summary =
        assistantMessage?.content?.[0]?.text?.value || "No summary found.";

      // Cleanup local file
      fs.unlinkSync(filePath);

      res.status(200).json({ summary });
    } catch (error: any) {
      console.error(
        "❌ Assistants API error:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Summarization failed" });
    }
  });
}
