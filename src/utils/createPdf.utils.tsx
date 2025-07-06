import { jsPDF } from "jspdf";

export const createPdf = (text: string) => {
  const doc = new jsPDF();

  // Split long text into lines to wrap
  const lines = doc.splitTextToSize(text, 180); // wrap at ~180 units

  doc.setFontSize(12);
  doc.text(lines, 15, 20); // text, x, y

  doc.save("summary.pdf");
};
