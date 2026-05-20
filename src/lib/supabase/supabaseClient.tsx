import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const signUpUser = async (email: string, password: string) =>
  await supabase.auth.signUp({ email, password });

export const signInUser = async (email: string, password: string) =>
  await supabase.auth.signInWithPassword({ email, password });

export const signInWithGoogle = async () =>
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://jspzywbkqyrkabfcadde.supabase.co/auth/v1/callback",
    },
  });
