import { useState } from "react";
import * as z from "zod/v4";
import { useForm } from "react-hook-form";

import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../../schema/signUp.schema";
import { createUser } from "../../lib/firebase/firebase";
import Navigation from "../../components/ui/navigation";
import { useNavigate, Link } from "react-router";
import { storeUser } from "../../lib/firebase/firebase";

import Spinner from "../../components/ui/spinner";
import Button from "../../components/ui/button";

type SignUpFormType = z.infer<typeof SignUpSchema>;

const SignUp = () => {
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  const onSubmit: SubmitHandler<SignUpFormType> = async ({
    name,
    email,
    password,
  }) => {
    setSignUpError(null);
    try {
      setIsSigningUp(true);
      const userCredential = await createUser(email, password);
      if (userCredential && userCredential.user) {
        navigate("/");
        // Optionally, you can store the user's name in the database
        await storeUser(userCredential.user, name);
      }
    } catch (error: any) {
      setSignUpError(error.code || "An error occurred during sign up.");
      console.error("Error creating user:", error);
    } finally {
      reset();
      setIsSigningUp(false);
    }
  };
  return (
    <>
      <Navigation />
      {isSigningUp && (
        <div className='fixed top-0 w-full h-screen bg-light-overlay backdrop-blur-sm'>
          <Spinner />
        </div>
      )}
      <div className='min-h-screen pt-25 flex items-center justify-center'>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className='shadow-container w-full lg:p-8 p-4 rounded-xl lg:w-[26rem] mx-4'
        >
          <h2 className='text-3xl text-center font-medium mb-7'>Sign Up</h2>
          {signUpError && (
            <p className=' text-red-500 text-center'>{signUpError.slice(5)}</p>
          )}
          <div className='flex flex-col mb-5'>
            <label htmlFor='name'>Name</label>
            <input
              {...register("name")}
              className='sign-input mt-2 text-md'
              id='name'
              type='text'
            />
            {errors.name && (
              <p className='text-sm text-red-500'>{errors.name.message}</p>
            )}
          </div>

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

          <div className='flex flex-col mt-5'>
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

          <Link to='/sign-in' className='text-sm text-center block mt-4'>
            Already have an account?{" "}
            <span className='text-sm text-light-green'>Sign In</span>
          </Link>

          <Button variant='primary' className='text-xl w-full rounded-md  mt-5'>
            Sign Up
          </Button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
