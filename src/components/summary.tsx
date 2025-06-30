import { useContext } from "react";

import { FileSummaryContext } from "../context/fileSummary.context";
import { SidebarContext } from "../context/sidebar.context";

import DragAndDropUploader from "./ui/dragAndDropUploader";
import pdfIcon from "../assets/pdf.png";
import pptIcon from "../assets/ppt.png";

const Summary = () => {
  const { file, setFile } = useContext(FileSummaryContext);
  const { toggleSidebar, animateMenu, isNavOpen } = useContext(SidebarContext);

  const changeFileHandler = () => {
    setFile(null);
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
        <h2 className='text-2xl'>Pdf and Powerpoint Summarizer</h2>
      </header>

      <div className='flex-grow-1 flex items-center justify-center'>
        <div className='shadow-xl p-10 rounded-xl text-center h-1/2 w-1/2'>
          <h3 className='text-4xl'>Select file</h3>
          <p className='text-[#847F7F]'>
            only PDF and PowerPoint files are supported
          </p>
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
                onClick={changeFileHandler}
                className='text-light-green underline'
              >
                Change
              </button>
              <button className='green-btn'>Upload</button>
            </div>
          ) : (
            <form className='mt-6 w-[65%] mx-auto' action=''>
              <DragAndDropUploader />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
