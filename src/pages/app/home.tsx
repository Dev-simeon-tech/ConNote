import { lazy } from "react";
import { Link } from "react-router";

import lengthIcon from "../assets/length.svg";
import weightIcon from "../assets/weight-scale.svg";
import temoeratureIcon from "../assets/celsius.svg";
import areaIcon from "../assets/area.svg";
import timeIcon from "../assets/clock.svg";
import speedIcon from "../assets/speedometer.svg";
import documentIcon from "../assets/document.svg";
import currencyIcon from "../assets/currency.png";

const Navigation = lazy(() => import("../../components/ui/navigation"));

const Home = () => {
  return (
    <>
      <Navigation />
      <div className='px-4 lg:px-10'>
        <main className='mt-35 text-center flex flex-col items-center gap-8 '>
          <h1 className='text-dark-green text-3xl lg:text-5xl'>
            Smarter Study Tools, All in One Place
          </h1>
          <p className='lg:max-w-2xl lg:text-lg '>
            Make learning easier with our all-in-one educational toolkit — from
            unit converters like temperature, weight, area, time, and even a
            currency converter, to intelligent PDF and PowerPoint summarizers.
            Whether you're a student, teacher, or curious learner, our tools
            save time and boost understanding instantly.
          </p>
          <img
            src='/hero-illustration.webp'
            fetchPriority='high'
            alt='calculator and note app illustration'
          />
        </main>
        <section className='text-center mt-20'>
          <h2 className='text-2xl lg:text-4xl pb-4 text-dark-green'>
            Select a Tool
          </h2>
          <h3 className='text-xl lg:text-2xl text-left py-4'>Converters</h3>
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
            <Link to='/tools/currency'>
              <button className='tools-btn'>
                <img
                  className='w-10'
                  src={currencyIcon}
                  alt='image of dollar exchage to euro'
                />
                <p>Currency</p>
              </button>
            </Link>
          </div>
          <h3 className='text-xl lg:text-left lg:text-2xl mt-10 py-4'>
            Note Tools
          </h3>

          <div className='lg:w-[90%] lg:mx-auto grid lg:grid-cols-4 gap-8'>
            <Link to='/tools/summarizer'>
              <button className='tools-btn'>
                <img src={documentIcon} alt='image of a document' />
                <p>PDF & PowerPoint summarizer</p>
              </button>
            </Link>
          </div>
        </section>
      </div>
      <footer className='bg-dark-green text-white text-center py-6 px-4 mt-20'>
        Copyrights &copy; 2025 ConNote | Coded by Dev Simeon
      </footer>
    </>
  );
};

export default Home;
