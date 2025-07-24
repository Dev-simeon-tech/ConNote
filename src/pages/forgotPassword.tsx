import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod/v4";
import { Link } from "react-router";
import { ForgotPasswordSchema } from "../schema/forgotPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "../utils/firebase/firebase.utils";
import Navigation from "../components/ui/navigation";
import type { SubmitHandler } from "react-hook-form";
import emailIcon from "../assets/email.png";

type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });
  const [emailValue, setEmailValue] = useState("");
  const [resetPasswordStatus, setResetPasswordStatus] = useState<
    "idle" | "sent" | "error"
  >("idle");

  const onSubmit: SubmitHandler<ForgotPasswordType> = async ({ email }) => {
    setEmailValue(email);
    try {
      await resetPassword(email);
      setResetPasswordStatus("sent");
    } catch (e) {
      console.error("Error sending reset password email:", e);
      setResetPasswordStatus("error");
    }
  };
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Navigation />
      <div className='shadow-container w-full lg:p-8 p-4 rounded-xl lg:w-[35rem] mx-4'>
        {resetPasswordStatus === "sent" ? (
          <div className='flex flex-col items-center'>
            <h2 className='text-3xl text-center font-medium mb-4'>
              Check your Email
            </h2>

            <img className='w-16 pb-6' src={emailIcon} alt='email' />

            <p className='text-center'>
              We have sent a password recovery your email{" "}
              <span className='font-bold'>{emailValue}</span>
            </p>

            <Link to='/sign-in'>
              <button className='text-lg rounded-md w-fit block mx-auto green-to-transparent mt-5 py-2.5 px-5'>
                Back to Sign In
              </button>
            </Link>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <h2 className='text-3xl text-center font-medium mb-4'>
              Forgot Password
            </h2>
            <p className='text-dark-gray text-center'>
              Enter your email and we will send you a link to reset your
              password
            </p>

            <div className='flex flex-col mt-5'>
              <label htmlFor='email'>Email Address</label>
              <input
                className='sign-input mt-2 text-md placeholder:text-dark-gray'
                {...register("email")}
                placeholder='example@domain.com'
                type='email'
                id='email'
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <button className='text-lg rounded-md w-fit block mx-auto green-to-transparent mt-5 py-2.5 px-5'>
              Reset Password
            </button>

            <Link
              to='/sign-in'
              className='text-dark-gray text-center block hover:text-brownish-gray underline mt-10'
            >
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
