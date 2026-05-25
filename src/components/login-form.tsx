import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod/v4";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/schema/signIn.schema";
import { useNavigate } from "react-router";
import { useAlert } from "@/hooks/useAlert";

import GoogleIcon from "@/assets/google.svg?react";
import { signInUser, signInWithGoogle } from "@/lib/supabase/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";

type SignInFormType = z.infer<typeof SignInSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { control, handleSubmit } = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
  });
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const onSubmit: SubmitHandler<SignInFormType> = async ({
    email,
    password,
  }) => {
    try {
      setIsLoggingIn(true);
      const { error, data } = await signInUser(email, password);
      console.log(data, error);
      if (!error) {
        navigate("/home");
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setAlert({
        message: "Failed to sign in. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await signInWithGoogle();

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAlert({
        message: "Failed to sign in with Google. Please try again.",
        type: "error",
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='email'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='password'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='flex items-center'>
                      <FieldLabel htmlFor='password'>Password</FieldLabel>
                      <a
                        href='#'
                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      {...field}
                      id='password'
                      type='password'
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button size='lg' disabled={isLoggingIn} type='submit'>
                  {isLoggingIn ? (
                    <div className='flex gap-2 items-center'>
                      <CircularProgress color='inherit' size={20} />
                      ...Logging in
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  variant='outline'
                  type='button'
                >
                  <GoogleIcon width={"2rem"} height={"2rem"} />
                  <span>Login with Google</span>
                </Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <Link to='/signup'>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
