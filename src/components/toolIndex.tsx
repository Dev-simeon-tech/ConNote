import { Link } from "react-router";
import Navigation from "../components/ui/navigation";

import LengthIcon from "../assets/length.svg?react";
import WeightIcon from "../assets/weight-scale.svg?react";
import TemperatureIcon from "../assets/celsius.svg?react";
import AreaIcon from "../assets/area.svg?react";
import TimeIcon from "../assets/clock.svg?react";
import SpeedIcon from "../assets/speedometer.svg?react";
import DocumentIcon from "../assets/document.svg?react";
import CurrencyIcon from "../assets/currency.svg?react";

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
              <LengthIcon
                width={"2.25rem"}
                height={"2.25rem"}
                className='w-20'
              />
              <p>Length</p>
            </button>
          </Link>
          <Link to='/tools/weight'>
            <button className='tools-btn'>
              <WeightIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Weight and Mass</p>
            </button>
          </Link>
          <Link to='/tools/temperature'>
            <button className='tools-btn'>
              <TemperatureIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Temperature</p>
            </button>
          </Link>
          <Link to='/tools/area'>
            <button className='tools-btn'>
              <AreaIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Area</p>
            </button>
          </Link>
          <Link to='/tools/time'>
            <button className='tools-btn'>
              <TimeIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Time</p>
            </button>
          </Link>
          <Link to='/tools/speed'>
            <button className='tools-btn'>
              <SpeedIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Speed</p>
            </button>
          </Link>
          <Link to='/tools/currency'>
            <button className='tools-btn'>
              <CurrencyIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Currency</p>
            </button>
          </Link>
          <Link to='/tools/summarizer'>
            <button className='tools-btn'>
              <DocumentIcon width={"2.25rem"} height={"2.25rem"} />
              <p>PDF & PowerPoint summarizer</p>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ToolIndex;
