import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { filename, contentType } = req.body;
  const { url: uploadUrl, url } = await put(
    filename,
    req.body, // or { contentType, access: "public" } if that's the correct options object
    { access: "public" } // Provide the third argument as optionsInput
  );

  res.status(200).json({ uploadUrl, blobUrl: url });
}
