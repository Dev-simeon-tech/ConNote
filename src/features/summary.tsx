import { useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

import { FileSummaryContext } from "../context/fileSummary.context";
import LinearProgress from "@mui/joy/LinearProgress";
import SummarySkeleton from "../components/ui/summarySkeleton";
import { createPdf } from "../utils/createPdf.utils";
import { formatSummaryToHTML } from "../utils/formatSummaryToHtml";

import DragAndDropUploader from "../components/ui/dragAndDropUploader";
import MenuButton from "../components/ui/menuButton";

import pdfIcon from "../assets/pdf.png";
import pptIcon from "../assets/ppt.png";
import noteIcon from "../assets/notepad.png";
import quizIcon from "../assets/quiz-icon.svg";
import downloadIcon from "../assets/download-icon.svg";
import refreshIcon from "../assets/refresh.png";

const Summary = () => {
  const { file, setFile, isProcessing, setIsProcessing, setSummary, summary } =
    useContext(FileSummaryContext);
  const [uploadProgress, setUploadProgress] = useState(0);

  const changeFileHandler = () => {
    setFile(null);
  };
  const resetSummaryHandler = () => {
    setFile(null);
    setUploadProgress(0);
    setSummary("");
    setIsProcessing(false);
  };

  const handleDirectUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    setIsProcessing(true);
    setUploadProgress(0);
    setSummary("");

    try {
      const res = await axios.post("/api/summarize", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(percent);
        },
      });

      setSummary(res.data.summary);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setFile(null);
      setIsProcessing(false);
    }
  };
  const handleCloudUpload = async () => {
    if (!file) return alert("Please select a file");

    setIsProcessing(true);
    setUploadProgress(0);
    setSummary("");

    try {
      // Step 1: Get presigned upload URL
      setUploadProgress(5);
      const { data: uploadData } = await axios.post("/api/getUploadUrl", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Step 2: Upload directly to S3
      setUploadProgress(10);
      await axios.put(uploadData.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          const percent = Math.round(10 + (e.loaded * 60) / (e.total || 1));
          setUploadProgress(percent);
        },
      });

      // Step 3: Process the uploaded file
      setUploadProgress(70);
      const { data: result } = await axios.post(
        "/api/summarize",
        {
          fileKey: uploadData.fileKey,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setUploadProgress(100);
      setSummary(result.summary);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setFile(null);
      setIsProcessing(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB <= 4) {
      await handleDirectUpload();
    } else {
      await handleCloudUpload();
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='flex h-[10vh] w-full items-center top-0 gap-4 p-4 '>
        <MenuButton />
        <h2 className='lg:text-2xl text-xl'>Pdf and Powerpoint Summarizer</h2>
      </header>

      <div className='flex-grow-1 flex items-center justify-center'>
        {uploadProgress === 100 ? (
          <div className='lg:w-[65%] w-full m-2 relative'>
            <button
              onClick={resetSummaryHandler}
              className='absolute top-1 right-1'
            >
              <img className='w-8' src={refreshIcon} alt='reset' />
            </button>
            <div className='bg-[#CCFFF3] h-[33rem] border-l-6 rounded-xl border-l-[#00CD1F] lg:p-8 p-4 w-full overflow-y-auto'>
              <div className='flex items-center gap-2'>
                <img className='w-10' src={noteIcon} alt='notepad' />
                <h3 className='text-3xl'>Summary</h3>
              </div>
              <div className='mt-15'>
                {!summary ? (
                  <SummarySkeleton />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatSummaryToHTML(summary),
                    }}
                  />
                )}
              </div>
            </div>

            {summary && (
              <div className='flex flex-col lg:flex-row mt-5 gap-5 lg:gap-10  justify-center'>
                <Link
                  to='/quiz'
                  className='summary-btn bg-dark-green text-white  hover:bg-light-green '
                >
                  <p>Generate quiz </p>
                  <img src={quizIcon} className='w-8' alt='quiz' />
                </Link>

                <button
                  onClick={() => createPdf(summary)}
                  className='summary-btn border-2 bg-transparent border-dark-green'
                >
                  <p>DownLoad pdf</p>
                  <img src={downloadIcon} className='w-8' alt='download' />
                </button>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleUpload}
            className='shadow-container p-10 rounded-xl text-center h-1/2 m-4 lg:w-1/2'
          >
            <h3 className='text-4xl'>Select file</h3>
            <p className='text-[#847F7F]'>
              only PDF and PowerPoint files are supported
            </p>
            {isProcessing ? (
              <div className='mt-20 mb-10'>
                <LinearProgress
                  determinate
                  color='success'
                  value={uploadProgress}
                />
              </div>
            ) : (
              <>
                {file ? (
                  <div className='flex mt-10 flex-col gap-5 items-center justify-center'>
                    <div className='flex items-center gap-4'>
                      <img
                        className='w-10'
                        src={file.name.endsWith(".pdf") ? pdfIcon : pptIcon}
                        alt='document logo'
                      />
                      <p>{file.name}</p>
                    </div>
                    <button
                      type='button'
                      onClick={changeFileHandler}
                      className='text-light-green underline'
                    >
                      Change
                    </button>
                    <button className='green-btn'>Upload</button>
                  </div>
                ) : (
                  <div className='mt-6 lg:w-[65%] mx-auto'>
                    <DragAndDropUploader />
                  </div>
                )}
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Summary;
