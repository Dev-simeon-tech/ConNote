import type { ReactNode } from "react";
import errorImg from "../../assets/warning.png";

const Error = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col mt-20 justify-center h-screen'>
      <img src={errorImg} alt='error' />
      {children}
    </div>
  );
};

export default Error;
