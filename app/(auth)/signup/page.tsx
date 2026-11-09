import type { Metadata } from "next";
import { Suspense } from "react";
import { KeepNextLink } from "@/components/keep-next-link";
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
      <Suspense>
        <SignUpForm />
      </Suspense>
      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Suspense>
          <KeepNextLink
            href="/login"
            className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
          >
            Log in
          </KeepNextLink>
        </Suspense>
      </p>
    </div>
  );
}
