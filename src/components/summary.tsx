import { useContext, useState } from "react";
import axios from "axios";

import { FileSummaryContext } from "../context/fileSummary.context";
import { SidebarContext } from "../context/sidebar.context";
import LinearProgress from "@mui/joy/LinearProgress";
import SummarySkeleton from "./ui/summarySkeleton";
import { createPdf } from "../utils/createPdf.utils";
import { formatSummaryToHTML } from "../utils/formatSummaryToHtml";

import DragAndDropUploader from "./ui/dragAndDropUploader";
import pdfIcon from "../assets/pdf.png";
import pptIcon from "../assets/ppt.png";
import noteIcon from "../assets/notepad.png";
import quizIcon from "../assets/quiz-icon.svg";
import downloadIcon from "../assets/download-icon.svg";
import refreshIcon from "../assets/refresh.png";

const Summary = () => {
  const { file, setFile, isProcessing, setIsProcessing, setSummary, summary } =
    useContext(FileSummaryContext);
  const { toggleSidebar, animateMenu, isNavOpen } = useContext(SidebarContext);
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    setIsProcessing(true);
    setUploadProgress(0);
    setSummary("");

    try {
      const blobUpload = await axios.post("/api/blobUploadUrl", {
        filename: file.name,
        contentType: file.type,
      });

      const { uploadUrl, blobUrl } = blobUpload.data;

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(percent);
        },
      });

      // Step 2: Send blob URL to summarization function
      const res = await axios.post("/api/summarize", { blobUrl });

      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setFile(null);
      setIsProcessing(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='flex h-[10vh] w-full items-center top-0 gap-4 p-4 '>
        <button
          className=' w-8 h-8 z-40   flex flex-col gap-1 items-center justify-center '
          onClick={toggleSidebar}
          aria-controls='sidebar-navigation'
          aria-expanded={isNavOpen}
        >
          <span className='sr-only'>Toggle sidebar navigation</span>

          {[0, 1, 2].map((__, index) => (
            <div
              key={index}
              className={`bg-black transition-all rounded-2xl duration-150  h-0.75 ${
                animateMenu ? "w-3" : "w-6"
              }`}
            ></div>
          ))}
        </button>
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
                <button className='summary-btn bg-dark-green text-white  hover:bg-light-green '>
                  <p>Generate quiz </p>
                  <img src={quizIcon} className='w-8' alt='quiz' />
                </button>

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
