type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className='green-to-transparent  py-2 px-4 text-lg  lg:px-8 rounded-lg'
    >
      {children}
    </button>
  );
};

export default Button;
