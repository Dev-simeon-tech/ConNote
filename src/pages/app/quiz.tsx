import comingSoon from "../../assets/coming-soon.svg";

const Quiz = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-6xl'>Coming soon!!!</h1>
      <img src={comingSoon} alt='coming soon' />
    </div>
  );
};

export default Quiz;
