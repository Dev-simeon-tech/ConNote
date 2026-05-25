import Logo from "@/assets/logo.svg?react";
import { SignupForm } from "@/components/signup-form";
import { Link } from "react-router";

export default function SignupPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Link
          to='/'
          className='flex items-center gap-2 self-center font-medium'
        >
          <Logo className='w-7 h-7' />
          ConNote
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
