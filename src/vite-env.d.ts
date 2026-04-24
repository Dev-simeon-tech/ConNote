/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    numrender: number;
    // @ts-ignore
    info: any;
    // @ts-ignore
    metadata: any;
    version: string;
    text: string;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export = pdf;
}
