import pdf from "pdf-parse";

const isTextExtractablePDF = async (fileBuffer: Buffer): Promise<boolean> => {
  try {
    const data = await pdf(fileBuffer);
    const cleanText = data.text.trim();

    // Check for minimum length and reasonable content
    const hasMinimumText = cleanText.length > 100;
    const wordsCount = cleanText.split(/\s+/).length;
    const hasReasonableWords = wordsCount > 20; // At least 20 words

    return hasMinimumText && hasReasonableWords;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return false; // Default to OCR if parsing fails
  }
};

export default isTextExtractablePDF;
