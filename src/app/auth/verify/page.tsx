import Link from "next/link";
import { redirect } from "next/navigation";

import { VerifyOtpForm } from "../auth-forms";
import { verifyOtpAction } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ghanovia | Verify phone",
  description: "Enter the SMS code to finish signup.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect("/become-pro");
  }

  const phoneParam = searchParams?.phone;
  const defaultPhone = Array.isArray(phoneParam) ? phoneParam[0] : phoneParam;

  return (
    <div className="bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Verify your phone
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Enter the OTP we sent to your UK number.
          </h1>
          <p className="text-muted-foreground">
            Once verified, we start your session and send you to build your pro
            profile.
          </p>
          <div className="text-sm text-muted-foreground">
            Need to sign up first?{" "}
            <Link className="text-primary underline" href="/auth/signup">
              Go to signup
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <VerifyOtpForm action={verifyOtpAction} defaultPhone={defaultPhone} />
          <div className="rounded-lg border bg-background/70 p-6">
            <p className="text-sm font-semibold text-primary">Tips</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Codes expire quickly—enter it as soon as you receive it.</li>
              <li>• Ensure the number matches the one used at signup.</li>
              <li>
                • If you didn&apos;t get a code, resend from Supabase dashboard
                or re-run signup.
              </li>
            </ul>
            <div className="mt-4 text-sm">
              Already verified?{" "}
              <Link className="text-primary underline" href="/auth/signin">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
