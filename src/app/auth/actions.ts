"use server";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = {
  error?: string;
  success?: string;
};

const phoneSchema = z
  .string()
  .min(8, "Phone is required")
  .regex(/^\+44\d{9,10}$/, "Use a UK phone starting with +44");

const passwordSchema = z.string().min(6, "Password must be at least 6 chars");

const roleSchema = z.enum(["customer", "professional"]);

export async function signUpAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const phone = phoneSchema.parse(formData.get("phone")?.toString().trim());
    const password = passwordSchema.parse(
      formData.get("password")?.toString().trim(),
    );
    const username = (formData.get("username")?.toString().trim() ?? "").slice(
      0,
      50,
    );
    const role = roleSchema.parse(formData.get("role")?.toString());

    const { error } = await supabase.auth.signUp({
      phone,
      password,
      options: {
        data: {
          username,
          role,
        },
        channel: "sms",
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: "OTP sent. Check your phone for the code." };
  } catch (err) {
    return { error: formatError(err, "Something went wrong signing up") };
  }
}

export async function verifyOtpAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const phone = phoneSchema.parse(formData.get("phone")?.toString().trim());
    const token = (formData.get("token")?.toString().trim() ?? "").slice(0, 8);
    if (!token) {
      return { error: "Enter the OTP code you received" };
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      return { error: error.message };
    }

    // After verification, create or update the user's profile row.
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return { success: "Phone verified and session started." };
    }

    const role =
      (userData.user.user_metadata as Record<string, string> | null)?.role ??
      "professional";
    const fullName =
      (userData.user.user_metadata as Record<string, string> | null)
        ?.username ?? null;

    await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userData.user.id,
          role,
          full_name: fullName,
        },
        { onConflict: "user_id" },
      );

    return { success: "Phone verified and session started." };
  } catch (err) {
    return { error: formatError(err, "Error verifying OTP") };
  }
}

export async function signInAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const phone = phoneSchema.parse(formData.get("phone")?.toString().trim());
    const password = passwordSchema.parse(
      formData.get("password")?.toString().trim(),
    );

    const { error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: "Signed in." };
  } catch (err) {
    return { error: formatError(err, "Something went wrong signing in") };
  }
}

export async function signOutAction(_formData: FormData): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { success: "Signed out." };
  } catch (err) {
    return { error: formatError(err, "Something went wrong signing out") };
  }
}

function formatError(err: unknown, fallback: string) {
  if (err instanceof z.ZodError) {
    return err.errors?.[0]?.message ?? "Invalid input";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
