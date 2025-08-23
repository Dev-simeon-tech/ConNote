import comingSoon from "../../assets/coming-soon.svg";

const Quiz = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-10'>
      <h1 className='lg:text-6xl text-2xl text-center'>Coming soon!!!</h1>
      <img className='w-50 lg:w-fit' src={comingSoon} alt='coming soon' />
    </div>
  );
};

export default Quiz;
