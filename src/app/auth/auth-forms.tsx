"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActionResult = {
  error?: string;
  success?: string;
};

type FormAction = (
  state: ActionResult,
  payload: FormData,
) => Promise<ActionResult>;

const initialState: ActionResult = { error: undefined, success: undefined };

function PendingButton({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      className="w-full"
    >
      {pending ? "Working..." : children}
    </Button>
  );
}

export function SignupForm({ action }: { action: FormAction }) {
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();
  const phoneRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (state?.success) {
      const phone = phoneRef.current?.value || "";
      const search = phone ? `?phone=${encodeURIComponent(phone)}` : "";
      router.push(`/auth/verify${search}`);
    }
  }, [router, state?.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Create an account with phone, password, and role. We&apos;ll send an
          OTP to verify your number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">
              UK phone number
            </label>
            <Input
              id="phone"
              name="phone"
              inputMode="tel"
              placeholder="+447..."
              required
              ref={phoneRef}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              name="username"
              placeholder="Ama"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select name="role" defaultValue="professional" required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <PendingButton>Send OTP</PendingButton>
          <FormStatus state={state} />
        </form>
      </CardContent>
    </Card>
  );
}

export function VerifyOtpForm({
  action,
  defaultPhone,
}: {
  action: FormAction;
  defaultPhone?: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/become-pro");
    }
  }, [router, state?.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify phone</CardTitle>
        <CardDescription>
          Enter the code sent by SMS to finish signup and start a session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone-verify">
              UK phone number
            </label>
            <Input
              id="phone-verify"
              name="phone"
              inputMode="tel"
              placeholder="+447..."
              required
              defaultValue={defaultPhone}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="otp">
              OTP code
            </label>
            <Input
              id="otp"
              name="token"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              required
            />
          </div>
          <PendingButton>Verify & Continue</PendingButton>
          <FormStatus state={state} />
        </form>
      </CardContent>
    </Card>
  );
}

export function SigninForm({ action }: { action: FormAction }) {
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/become-pro");
    }
  }, [router, state?.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Existing users can sign in with phone + password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone-signin">
              UK phone number
            </label>
            <Input
              id="phone-signin"
              name="phone"
              inputMode="tel"
              placeholder="+447..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password-signin">
              Password
            </label>
            <Input
              id="password-signin"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <PendingButton>Sign in</PendingButton>
          <FormStatus state={state} />
        </form>
      </CardContent>
    </Card>
  );
}

export function SignoutForm({
  action,
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  className?: string;
}) {
  return (
    <form action={action} className={className}>
      <Button type="submit" variant="outline" className="w-full">
        Sign out
      </Button>
    </form>
  );
}

function FormStatus({ state }: { state: ActionResult }) {
  if (!state.error && !state.success) return null;
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm ${
        state.error
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-emerald-500/50 bg-emerald-50 text-emerald-700"
      }`}
    >
      {state.error || state.success}
    </div>
  );
}
