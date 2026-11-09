import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl">Let&apos;s get you started</h1>
        <p className="text-muted-foreground">
          Create your own account first. You&apos;ll invite your partner in a
          moment.
        </p>
      </header>
      <SignUpForm />
      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
