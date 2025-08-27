/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export = pdf;
}
