import type { ReactNode } from "react";
import ErrorImg from "../../assets/warning.svg?react";

const Error = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col mt-20 justify-center h-screen'>
      <ErrorImg width={"4.5rem"} height={"4.5rem"} />
      {children}
    </div>
  );
};

export default Error;
