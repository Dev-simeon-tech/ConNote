import Skeleton from "@mui/joy/Skeleton";

const SummarySkeleton = () => {
  return (
    <div>
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <div className='h-6'></div>
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
      <Skeleton animation='wave' variant='text' />
    </div>
  );
};

export default SummarySkeleton;
