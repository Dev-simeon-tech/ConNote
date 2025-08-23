import { useState } from "react";
import { useNavigate } from "react-router";

import { Link } from "react-router";
import * as z from "zod/v4";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "../../lib/firebase/firebase";
import { signInWithGoogle } from "../../lib/firebase/firebase";
import { SignInSchema } from "../../schema/signIn.schema";

import Navigation from "../../components/ui/navigation";
import Spinner from "../../components/ui/spinner";
import googleIcon from "../../assets/google.png";

type SignInFormType = z.infer<typeof SignInSchema>;

const SignIn = () => {
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormType> = async ({
    email,
    password,
  }) => {
    setSignInError(null);
    try {
      setIsSigningIn(true);
      const userCredential = await signInUser(email, password);
      if (userCredential && userCredential.user) {
        navigate("/");
      }
    } catch (e: any) {
      setSignInError(e.code);
      console.log(e.code);
    } finally {
      reset();
      setIsSigningIn(false);
    }
  };

  const googleSignInHandler = async () => {
    setSignInError(null);
    try {
      const userCredential = await signInWithGoogle();
      setIsSigningIn(true);
      if (userCredential.user) {
        navigate("/");
      }
    } catch (e: any) {
      setSignInError(e.code);
      console.log(e);
    } finally {
      reset();
      setIsSigningIn(false);
    }
  };

  return (
    <>
      <Navigation />
      {isSigningIn && (
        <div className='fixed top-0 w-full h-screen bg-light-overlay backdrop-blur-sm'>
          <Spinner />
        </div>
      )}
      <div className='min-h-screen pt-20 flex items-center justify-center'>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className='shadow-container w-full lg:p-8 p-4 rounded-xl lg:w-[26rem] mx-4'
        >
          <h2 className='text-3xl text-center font-medium mb-7'>Sign In</h2>
          {signInError && (
            <p className='text-center text-red-500'>{signInError.slice(5)}</p>
          )}

          <div className='flex flex-col'>
            <label htmlFor='email'>Email Address</label>
            <input
              {...register("email")}
              className='sign-input mt-2 text-md'
              id='email'
              type='email'
            />
            {errors.email && (
              <p className='text-sm text-red-500'>{errors.email.message}</p>
            )}
          </div>

          <div className='flex flex-col mt-4'>
            <label htmlFor='password'>Password</label>
            <input
              {...register("password")}
              className='sign-input mt-2'
              id='password'
              type='password'
            />
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>

          <div className='flex justify-between max-[30rem]:flex-col max-[30rem]:justify-center items-center text-center mt-5'>
            <Link to='/sign-up' className='text-sm'>
              Don't have an account?
              <span className='text-sm text-light-green'>SIgnup</span>
            </Link>
            <Link
              to='/forgot-password'
              className='text-brownish-gray text-sm hover:underline mt-1'
            >
              Forgot Password?
            </Link>
          </div>
          <button className='text-xl w-full rounded-md green-to-transparent mt-5 py-2.5 px-5'>
            Sign in
          </button>

          <div className='flex mt-5 items-center gap-3'>
            <div className='border-1 flex-1 h-0 border-light-gray '></div>
            <p>or</p>
            <div className='border-1 flex-1 h-0 border-light-gray'></div>
          </div>
          <button
            type='button'
            onClick={googleSignInHandler}
            className='flex gap-4 max-[23rem]:flex-col py-2 rounded-md px-6 mt-5 justify-center items-center w-full border-1 border-light-gray'
          >
            <img className='w-6' src={googleIcon} alt='google' />
            <p className='text-xl'>Sign in with Google</p>
          </button>
        </form>
      </div>
    </>
  );
};

export default SignIn;
