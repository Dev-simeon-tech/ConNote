import Navigation from "../../components/ui/navigation";
import Footer from "../../components/ui/footer";

const About = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navigation />
      <main className='text-center flex-1 mt-35 px-4'>
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
      <section className='mt-20 flex-1 lg:w-[80%] mx-auto px-4'>
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
      <Footer />
    </div>
  );
};

export default About;
