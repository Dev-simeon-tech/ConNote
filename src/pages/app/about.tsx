import Navigation from "../../components/ui/navigation";

const About = () => {
  return (
    <div className='px-4'>
      <Navigation />
      <main className='text-center mt-35'>
        <h2 className='lg:text-5xl text-3xl text-dark-green'>About us</h2>
        <p className='my-10 lg:max-w-[80ch] mx-auto '>
          ConNote, is all about making learning more accessible, efficient, and
          engaging for students, educators, and lifelong learners. Our platform
          offers a growing suite of smart educational tools designed to simplify
          complex tasks and save valuable time.
        </p>
        <p className='lg:max-w-[80ch] mx-auto'>
          We started with a simple mission: to remove the friction from everyday
          academic tasks. Today, we offer a wide range of intuitive, web-based
          tools you can use from anywhere, anytime.
        </p>
      </main>
      <section className='mt-20 lg:w-[80%] mx-auto'>
        <h3 className='lg:text-2xl text-xl pb-8'>What We Offer:</h3>
        <ul className='about-offer space-y-6'>
          <li>
            Unit Calculators: Convert units quickly and accurately — whether
            it's temperature, weight, mass, area, time, or length. No more
            manual math or conversion charts.
          </li>
          <li>
            PDF & PowerPoint Summarizer: Upload any PDF or PowerPoint file and
            get a clear, concise summary in seconds. Ideal for reviewing lecture
            notes, academic papers, or long reports.
          </li>
          <li>
            User-Friendly Interface: Every tool is designed to be simple and
            fast — no downloads, no learning curve.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About;
