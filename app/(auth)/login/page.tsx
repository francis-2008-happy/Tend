import type { Metadata } from "next";
import { KeepNextLink } from "@/components/keep-next-link";
import { Suspense } from "react";
import { LoginForms } from "./login-forms";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl">Welcome back</h1>
        <p className="text-muted-foreground">Lovely to see you.</p>
      </header>
      <Suspense>
        <LoginForms />
      </Suspense>
      <p className="text-center text-muted-foreground">
        New to Tend?{" "}
        <Suspense>
          <KeepNextLink
            href="/signup"
            className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
          >
            Create an account
          </KeepNextLink>
        </Suspense>
      </p>
    </div>
  );
}
