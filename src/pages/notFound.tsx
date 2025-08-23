import { Link } from "react-router";
import Button from "../components/ui/Button";
import Footer from "../components/ui/footer";

const NotFound = () => {
  return (
    <>
      <div className='h-[80vh] flex flex-col justify-center items-center'>
        <h1 className='text-[13rem] font-semibold text-dark-green'>404</h1>
        <h2 className='text-4xl pb-8'>Page not Found</h2>
        <Link to='/'>
          <Button>Go to Home</Button>
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
