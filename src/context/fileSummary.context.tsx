import { createContext, useState, useRef } from "react";

type FileSummaryContextType = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
  setIsprocessing: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export const FileSummaryContext = createContext({} as FileSummaryContextType);

export const FileSummaryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsprocessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const value = {
    file,
    setFile,
    summary,
    setSummary,
    isProcessing,
    setIsprocessing,
    fileInputRef,
  };
  return (
    <FileSummaryContext.Provider value={value}>
      {children}
    </FileSummaryContext.Provider>
  );
};
