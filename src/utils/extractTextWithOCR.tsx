import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const extractTextWithOCR = async (
  filePath: string,
  apikey: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("apikey", apikey);
  formData.append("OCREngine", "2");
  formData.append("isOverlayRequired", "false");
  formData.append("language", "eng");

  const response = await axios.post(
    "https://api.ocr.space/parse/image",
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  const parsedResults = response.data.ParsedResults;
  if (!parsedResults || parsedResults.length === 0) return "";

  return parsedResults
    .map((res: any) => res.ParsedText)
    .join("\n")
    .trim();
};

export default extractTextWithOCR;
