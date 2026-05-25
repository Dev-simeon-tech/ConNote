import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as z from "zod/v4";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/schema/signUp.schema";
import { useAlert } from "@/hooks/useAlert";
import { useState } from "react";
import {
  signUpUser,
  storeUserData,
  signInWithGoogle,
} from "@/lib/supabase/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";

import GoogleIcon from "@/assets/google.svg?react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof SignUpSchema>> = async ({
    name,
    email,
    password,
  }) => {
    try {
      setIsSigningUp(true);
      const { error, data } = await signUpUser(email, password, name);
      const userUid = data?.user?.id;
      if (!error) {
        const { error, data } = await storeUserData(userUid, name, email);
        console.log({ error, data });
        navigate("/home");
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setAlert({
        type: "error",
        message: (error as Error).message,
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error, data } = await signInWithGoogle();

      if (error && data) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAlert({
        message: "Failed to sign in with Google. Please try again.",
        type: "error",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='name'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                    <Input
                      {...field}
                      id='name'
                      type='text'
                      placeholder='John Doe'
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
                name='email'
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      required
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Field className='grid grid-cols-2 gap-4'>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='password'>Password</FieldLabel>
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
                  <Controller
                    name='confirmPassword'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='confirmPassword'>
                          Confirm Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id='confirmPassword'
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
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button disabled={isSigningUp} type='submit'>
                  {isSigningUp ? (
                    <div className='flex gap-2 items-center'>
                      <CircularProgress color='inherit' size={20} />
                      ...Signning in
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningUp}
                  variant='outline'
                  type='button'
                >
                  <GoogleIcon width={"2rem"} height={"2rem"} />
                  <span>Sign up with Google</span>
                </Button>
                <FieldDescription className='text-center'>
                  Already have an account? <Link to='/login'>Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className='px-6 text-center'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{" "}
        and <a href='#'>Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
