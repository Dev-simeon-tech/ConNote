import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LayoutGrid,
  FileText,
  CircleQuestionMark,
} from "lucide-react";
import { Link } from "react-router";

import LengthIcon from "@/assets/Length.svg?react";
import TempIcon from "@/assets/temp.svg?react";
import WeightIcon from "@/assets/weight.svg?react";
import SpeedIcon from "@/assets/speed.svg?react";
import TimeIcon from "@/assets/time.svg?react";
import CurrencyIcon from "@/assets/currency.svg?react";
import AreaIcon from "@/assets/area.svg?react";
import Sparkler from "@/assets/sparkler.svg?react";

const convertersData = [
  {
    name: "Length",
    icon: LengthIcon,
    badge: "popular",
  },
  {
    name: "Currency",
    icon: CurrencyIcon,
    badge: "Live",
  },
  {
    name: "Weight",
    icon: WeightIcon,
  },
  {
    name: "Temp",
    icon: TempIcon,
  },
  {
    name: "Area",
    icon: AreaIcon,
  },
  {
    name: "Time",
    icon: TimeIcon,
  },
  {
    name: "Speed",
    icon: SpeedIcon,
  },
];

const Home = () => {
  return (
    <div className='p-4 lg:p-8 bg-bg flex-1 flex-col flex'>
      <main className=' bg-surface p-12 rounded-4xl '>
        <Badge className='bg-[#85F8C4] text-[#002114] py-2.5 font-bold tracking-widest'>
          PRECISION INTELLIGENCE
        </Badge>
        <div className='mt-6'>
          <h1 className='text-6xl font-bold max-w-[10ch] text-text-heading'>
            Welcome to ConNote
          </h1>
          <p className='pt-4 pb-6 text-lg max-w-[48ch] leading-8 text-text-body'>
            Make learning easier with our all-in-one educational toolkit — from
            unit converters to AI-powered PDF/PowerPoint summarizers and quiz
            qenerator. Whether you're a student, teacher, or curious learner,
            our tools save time and boost understanding instantly.
          </p>
          <Link to={"/converters"}>
            <Button size={"lg"} className='py-6.5 px-6 group'>
              <span className='text-base'>Explore Converters</span>
              <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform' />
            </Button>
          </Link>
        </div>
      </main>
      <section className='mt-12'>
        <div className='flex gap-2 items-center'>
          <div className='p-1 bg-primary rounded-sm'>
            <LayoutGrid className='text-white' />
          </div>
          <h2 className='text-text-heading text-3xl font-bold'>
            Precision Converter
          </h2>
        </div>

        <div className='mt-8 flex flex-wrap  gap-10'>
          {convertersData.map((converter, index) => {
            const Icon = converter.icon;
            return (
              <Link
                className='flex-1 bg-white/20 p-8 rounded-4xl hover:shadow-xl shadow-md '
                key={index}
                to={`/${converter.name.toLowerCase()}`}
              >
                <div className=' flex flex-col   items-center'>
                  <div className=' bg-primary-subtle py-3 px-4 rounded-2xl flex items-center justify-center'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <span className='text-base font-bold mt-4'>
                    {converter.name}
                  </span>
                  {converter.badge && (
                    <Badge className='mt-2 bg-primary-light text-primary uppercase font-bold'>
                      {converter.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className='mt-12'>
        <div className='flex gap-2 items-center'>
          <Sparkler className='text-primary w-10 h-10' />
          <h2 className='text-text-heading text-3xl font-bold'>
            AI Powered Tools
          </h2>
        </div>

        <div className='flex gap-5 mt-8'>
          <div className='bg-surface p-10 flex-1 flex items-center gap-8 rounded-4xl'>
            <div className='p-5 rounded-2xl bg-primary'>
              <FileText className='text-white w-10 h-10' />
            </div>
            <div>
              <h3 className='font-bold text-2xl text-text-heading'>
                PDF & PPT Summarizer
              </h3>
              <p className='text-lg'>
                Drop a document and get a precision- engineered executive
                summary in seconds.
              </p>
              <Link
                className='flex items-center gap-2 group text-primary font-bold'
                to={"/tools/summary"}
              >
                <span>Try AI summary</span>
                <ArrowRight className='group-hover:translate-x-2 transition-transform' />
              </Link>
            </div>
          </div>
          <div className='bg-surface p-10 flex-1 flex items-center gap-8 rounded-4xl'>
            <div className='p-5 rounded-2xl bg-primary'>
              <CircleQuestionMark className='text-white w-10 h-10' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='font-bold text-2xl text-text-heading'>
                  Quiz Generator
                </h3>
                <Badge className='bg-[#85F8C4] text-primary font-bold'>
                  NEW
                </Badge>
              </div>
              <p className='text-lg'>
                Quiz generation helps yo find out how well you actually
                understood what you just read and track your scores and improve
                over time.
              </p>
              <Link
                className='flex items-center gap-2 group text-primary font-bold'
                to={"/tools/quiz"}
              >
                <span>Try AI Quiz</span>
                <ArrowRight className='group-hover:translate-x-2 transition-transform' />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
