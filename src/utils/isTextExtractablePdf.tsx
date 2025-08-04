import pdf from "pdf-parse";

const isTextExtractablePDF = async (fileBuffer: Buffer): Promise<boolean> => {
  const data = await pdf(fileBuffer);
  return data.text.trim().length > 100;
};
export default isTextExtractablePDF;
