import Link from "next/link";
import { redirect } from "next/navigation";

import { SignupForm } from "../auth-forms";
import { signUpAction } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ghanovia | Sign up",
  description: "Create your account with phone, password, and role.",
};

export default async function SignupPage() {
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
            Join Ghanovia
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Sign up with your UK phone number and choose your role.
          </h1>
          <p className="text-muted-foreground">
            We&apos;ll send you an SMS OTP to verify. Pros get routed to the
            verification step to finish onboarding.
          </p>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/auth/signin">
              Sign in
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <SignupForm action={signUpAction} />
          <div className="rounded-lg border bg-background/70 p-6">
            <p className="text-sm font-semibold text-primary">What to expect</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Enter phone + password + role.</li>
              <li>• We send an OTP via SMS.</li>
              <li>• Verify your phone to start your session.</li>
              <li>• Pros continue to build their profile.</li>
            </ul>
            <div className="mt-4 text-sm">
              Want to verify an existing account?{" "}
              <Link className="text-primary underline" href="/auth/verify">
                Go to verification
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
