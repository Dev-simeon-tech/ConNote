import CircularProgress from "@mui/material/CircularProgress";

const AppSpinner = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <CircularProgress color='success' />
    </div>
  );
};

export default AppSpinner;
