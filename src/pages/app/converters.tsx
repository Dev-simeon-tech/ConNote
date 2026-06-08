import { convertersData } from "@/data/convertersData";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import ConversionHistory from "@/features/converters/conversionHistory";
// import { converterColorSelector } from "@/utils/convertersColorSelector";

const Converters = () => {
  return (
    <main className='bg-bg '>
      <section className='p-12'>
        <article>
          <h2 className='text-2xl lg:text-4xl font-bold text-text-heading'>
            Unit Converters
          </h2>
          <p className='lg:max-w-[50ch] pt-5 text-lg'>
            Select a category to start converting. Results update in real time
            with precise architectural accuracy.
          </p>
        </article>

        <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2'>
          {convertersData.map((converter, index) => {
            const Icon = converter.icon;
            return (
              <Link to={`${converter.name.toLowerCase()}`}>
                <div
                  className='bg-white hover:border-l-6   border-primary rounded-3xl transition-all group p-8'
                  key={index}
                >
                  <div className='flex justify-between'>
                    <div className=' bg-primary-subtle py-3 px-4 rounded-2xl flex items-center justify-center'>
                      <Icon className='w-6 h-6' />
                    </div>
                    <button>
                      <ArrowRight className='text-text-placeholder group-hover:translate-x-5 transition-transform' />
                    </button>
                  </div>
                  <article className='mt-8'>
                    <h3 className='text-2xl font-bold '>{converter.name}</h3>
                    <p>{converter.description}</p>
                  </article>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <ConversionHistory />
    </main>
  );
};

export default Converters;
