import { lazy } from "react";
import { Link } from "react-router";
import Footer from "../../components/ui/footer";

import LengthIcon from "../../assets/length.svg?react";
import WeightIcon from "../../assets/weight-scale.svg?react";
import TemperatureIcon from "../../assets/celsius.svg?react";
import AreaIcon from "../../assets/area.svg?react";
import TimeIcon from "../../assets/clock.svg?react";
import SpeedIcon from "../../assets/speedometer.svg?react";
import DocumentIcon from "../../assets/document.svg?react";
import CurrencyIcon from "../../assets/currency.svg?react";

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
            src='/hero-illustration.jpg'
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
                <LengthIcon width={"2.25rem"} height={"2.25rem"} />
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
          </div>
          <h3 className='text-xl lg:text-left lg:text-2xl mt-10 py-4'>
            Note Tools
          </h3>

          <div className='lg:w-[90%] lg:mx-auto grid lg:grid-cols-4 gap-8'>
            <Link to='/tools/summarizer'>
              <button className='tools-btn'>
                <DocumentIcon width={"2.25rem"} height={"2.25rem"} />
                <p>PDF & PowerPoint summarizer</p>
              </button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
