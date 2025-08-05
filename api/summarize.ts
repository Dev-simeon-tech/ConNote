import axios from "axios";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import FormData from "form-data";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID!;
const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY!;

const openaiHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2",
};

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { blobUrl } = req.body;
  if (!blobUrl) return res.status(400).json({ error: "Missing blobUrl" });

  // Step 1: Download file from blob
  const tempFilePath = path.join(tmpdir(), `${uuidv4()}.pdf`);
  const fileWriter = fs.createWriteStream(tempFilePath);
  const response = await axios.get(blobUrl, { responseType: "stream" });
  await new Promise((resolve, reject) => {
    response.data.pipe(fileWriter);
    fileWriter.on("finish", () => resolve(undefined));
    fileWriter.on("error", reject);
  });

  // Step 2: Upload to OpenAI
  const fileForm = new FormData();
  fileForm.append("file", fs.createReadStream(tempFilePath));
  fileForm.append("purpose", "assistants");

  let fileId = null;
  try {
    const uploadRes = await axios.post(
      "https://api.openai.com/v1/files",
      fileForm,
      {
        headers: {
          ...fileForm.getHeaders(),
          ...openaiHeaders,
        },
      }
    );
    fileId = uploadRes.data.id;
  } catch (err) {
    console.warn("OpenAI file upload failed. Falling back to OCR...");
  }

  // Step 3: Try summarizing with OpenAI if upload succeeded
  if (fileId) {
    try {
      const thread = await axios.post(
        "https://api.openai.com/v1/threads",
        {},
        { headers: openaiHeaders }
      );
      const threadId = thread.data.id;

      await axios.post(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        {
          role: "user",
          content: "Please summarize the uploaded file.",
        },
        { headers: openaiHeaders }
      );

      const run = await axios.post(
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

      let status = run.data.status;
      while (status === "queued" || status === "in_progress") {
        await new Promise((r) => setTimeout(r, 2000));
        const statusRes = await axios.get(
          `https://api.openai.com/v1/threads/${threadId}/runs/${run.data.id}`,
          { headers: openaiHeaders }
        );
        status = statusRes.data.status;
      }

      const messages = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        { headers: openaiHeaders }
      );

      const assistantMsg = messages.data.data.find(
        (m) => m.role === "assistant"
      );
      const summary =
        assistantMsg?.content?.[0]?.text?.value || "No summary found";

      fs.unlinkSync(tempFilePath);
      return res.status(200).json({ summary });
    } catch (err) {
      console.warn("OpenAI summarization failed. Falling back to OCR...");
    }
  }

  // Step 4: OCR fallback
  try {
    const ocrForm = new FormData();
    ocrForm.append("url", blobUrl);
    ocrForm.append("language", "eng");
    ocrForm.append("isOverlayRequired", "false");

    const ocrRes = await axios.post(
      "https://api.ocr.space/parse/image",
      ocrForm,
      {
        headers: {
          apikey: OCR_SPACE_API_KEY,
          ...ocrForm.getHeaders(),
        },
      }
    );

    const parsedText =
      ocrRes.data.ParsedResults?.[0]?.ParsedText ||
      "No text extracted via OCR.";
    return res.status(200).json({ summary: parsedText });
  } catch (error) {
    return res.status(500).json({ error: "OCR and summarization failed" });
  }
}
