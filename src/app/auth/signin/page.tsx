import Link from "next/link";
import { redirect } from "next/navigation";

import { SigninForm } from "../auth-forms";
import { signInAction } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ghanovia | Sign in",
  description: "Access your account with phone and password.",
};

export default async function SigninPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect("/become-pro");
  }

  return (
    <div className="bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Sign in with your UK phone number and password.
          </h1>
          <p className="text-muted-foreground">
            We’ll start your session and send you to your pro onboarding.
          </p>
          <div className="text-sm text-muted-foreground">
            New here?{" "}
            <Link className="text-primary underline" href="/auth/signup">
              Create an account
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <SigninForm action={signInAction} />
          <div className="rounded-lg border bg-background/70 p-6">
            <p className="text-sm font-semibold text-primary">Need help?</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Use the same phone you verified with OTP.</li>
              <li>• Reset password from Supabase dashboard if needed.</li>
            </ul>
            <div className="mt-4 text-sm">
              Need to verify your phone?{" "}
              <Link className="text-primary underline" href="/auth/verify">
                Enter OTP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
