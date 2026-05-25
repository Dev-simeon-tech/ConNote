import CircularProgress from "@mui/material/CircularProgress";

const Spinner = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <CircularProgress color='inherit' />
    </div>
  );
};

export default Spinner;
