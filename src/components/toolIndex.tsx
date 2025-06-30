import { Link } from "react-router";
import Navigation from "../components/ui/navigation";

import lengthIcon from "../assets/length.svg";
import weightIcon from "../assets/weight-scale.svg";
import temoeratureIcon from "../assets/celsius.svg";
import areaIcon from "../assets/area.svg";
import timeIcon from "../assets/clock.svg";
import speedIcon from "../assets/speedometer.svg";
import documentIcon from "../assets/document.svg";

const ToolIndex = () => {
  return (
    <>
      <Navigation />
      <div className='mt-35 p-4'>
        <h2 className='text-dark-green text-center pb-15 lg:text-4xl text-2xl'>
          Our Tools
        </h2>
        <div className='grid grid-cols-1 lg:grid-cols-4 lg:w-[90%] lg:mx-auto gap-8'>
          <Link to='/tools/length'>
            <button className='tools-btn'>
              <img src={lengthIcon} alt='image of length' />
              <p>Length</p>
            </button>
          </Link>
          <Link to='/tools/weight'>
            <button className='tools-btn'>
              <img src={weightIcon} alt='image of weight scale' />
              <p>Weight and Mass</p>
            </button>
          </Link>
          <Link to='/tools/temperature'>
            <button className='tools-btn'>
              <img src={temoeratureIcon} alt='image of themometer' />
              <p>Temperature</p>
            </button>
          </Link>
          <Link to='/tools/area'>
            <button className='tools-btn'>
              <img src={areaIcon} alt='image of Area' />
              <p>Area</p>
            </button>
          </Link>
          <Link to='/tools/time'>
            <button className='tools-btn'>
              <img src={timeIcon} alt='image of clock' />
              <p>Time</p>
            </button>
          </Link>
          <Link to='/tools/speed'>
            <button className='tools-btn'>
              <img src={speedIcon} alt='image of speedometer' />
              <p>Speed</p>
            </button>
          </Link>
          <Link to='/tools/summarizer'>
            <button className='tools-btn'>
              <img src={documentIcon} alt='image of a document' />
              <p>PDF & PowerPoint summarizer</p>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ToolIndex;
