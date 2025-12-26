import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

function getEnv(name: string) {
  const value =
    process.env[name] ??
    (name === "SUPABASE_URL"
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  const supabaseUrl = getEnv("SUPABASE_URL");
  const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        // Optional chaining guards older Next runtimes that expose read-only cookies.
        const cookie = cookieStore?.get?.(name);
        return cookie?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore?.set?.({ name, value, ...options });
        } catch (error) {
          // noop; some contexts expose read-only cookies in dev
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore?.delete?.({ name, ...options });
        } catch (error) {
          // noop; some contexts expose read-only cookies in dev
        }
      },
    },
  });
}
