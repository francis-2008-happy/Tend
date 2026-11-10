import type { Metadata } from "next";
import Link from "next/link";
import { LeafSprig } from "@/components/leaf-sprig";

export const metadata: Metadata = { title: "Take care" };

/** Shown after an account is deleted. Kind, no guilt, no "come back". */
export default function GoodbyePage() {
  return (
    <div className="relative space-y-4 py-10 text-center">
      <LeafSprig className="mx-auto size-24 text-sage" />
      <h1 className="text-4xl leading-tight">Your account is deleted</h1>
      <p className="text-lg text-muted-foreground">
        Everything of yours has been removed from Tend and from this phone.
        Thank you for the time you spent here. Take good care of each other.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
      >
        Back to the start
      </Link>
    </div>
  );
}
