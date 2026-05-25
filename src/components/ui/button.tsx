import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "inverted";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = "py-2 px-4 text-lg lg:px-8 rounded-lg";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "border-2 border-transparent text-white bg-dark-green lg:hover:border-dark-green lg:hover:bg-transparent lg:hover:text-dark-green",
    inverted:
      "border-2 bg-transparent border-dark-green hover:bg-dark-green hover:text-white text-black",
  };

  return (
    <button
      onClick={onClick}
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
