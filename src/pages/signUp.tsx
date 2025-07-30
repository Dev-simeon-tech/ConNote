import { useState } from "react";
import * as z from "zod/v4";
import { useForm } from "react-hook-form";

import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../schema/signUp.schema";
import { createUser } from "../utils/firebase/firebase.utils";
import Navigation from "../components/ui/navigation";
import { useNavigate, Link } from "react-router";
import { storeUser } from "../utils/firebase/firebase.utils";

type SignUpFormType = z.infer<typeof SignUpSchema>;

const SignUp = () => {
  const [signUpError, setSignUpError] = useState<string | null>(null);
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
    try {
      setSignUpError(null);
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
    }
  };
  return (
    <div className='min-h-screen mt-20 flex items-center justify-center'>
      <Navigation />

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

        <button className='text-xl w-full rounded-md green-to-transparent mt-5 py-2.5 px-5'>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
