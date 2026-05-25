import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const signUpUser = async (
  email: string,
  password: string,
  name: string,
) =>
  await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
    },
  });

export const signInUser = async (email: string, password: string) =>
  await supabase.auth.signInWithPassword({ email, password });

export const signInWithGoogle = async () =>
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173/home",
      queryParams: {
        prompt: "select_account",
      },
    },
  });

export const signOutUser = async () => await supabase.auth.signOut();

export const getCurrentUser = () => supabase.auth.getUser();
export const getUserSession = () => supabase.auth.getSession();

export const storeUserData = async (
  id: string | undefined,
  name: string,
  email: string,
) => await supabase.from("users").insert({ id, name, email });

export async function upsertUserFromAuth(user: User | null) {
  if (!user) return;
  const id = user.id;
  const email = user.email ?? null;
  const metadata = user.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || null;

  return await supabase.from("users").upsert({
    id,
    name,
    email,
  });
}
