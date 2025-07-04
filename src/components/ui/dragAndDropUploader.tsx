import { useContext, useRef, useCallback, useState } from "react";

import { FileSummaryContext } from "../../context/fileSummary.context";
import uploadIcon from "../../assets/upload-icon.svg";

const DragAndDropUploader = () => {
  const { setFile } = useContext(FileSummaryContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.[0]) {
        const selectedFile = e.dataTransfer.files?.[0];
        if (
          selectedFile.name.endsWith(".pdf") ||
          selectedFile.name.endsWith(".ppt") ||
          selectedFile.name.endsWith(".pptx")
        ) {
          setFile(e.dataTransfer.files?.[0]);
        } else {
          setError("Unsupported file type");
        }
      }
    },
    [setFile]
  );

  const onClickHandler = () => {
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files?.[0]);
    }
    e.target.value = "";
  };
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className='border-2 flex flex-col p-8 gap-8 items-center justify-center border-gray border-dashed rounded-2xl'
    >
      <img src={uploadIcon} alt='upload' />
      <p className='text-xl'>
        {isDragging
          ? "Release to upload"
          : "Drag and drop files here, or click browse"}
      </p>

      <input
        ref={fileInputRef}
        id='file'
        type='file'
        accept='.pdf,.ppt,.pptx'
        onChange={onFileChangeHandler}
        style={{ display: "none" }}
      />
      {error && <p className='text-red-500'>{error}</p>}
      <button type='button' onClick={onClickHandler} className='green-btn'>
        Browse
      </button>
    </div>
  );
};

export default DragAndDropUploader;
