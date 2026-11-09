import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Check your email" };

export default function CheckEmailPage({
  searchParams,
}: PageProps<"/check-email">) {
  return (
    <div className="space-y-6">
      <span className="flex size-14 items-center justify-center rounded-full bg-tender-soft text-primary">
        <Mail className="size-7" aria-hidden="true" />
      </span>
      <Suspense fallback={<h1 className="text-3xl">Check your email</h1>}>
        <Message searchParams={searchParams} />
      </Suspense>
      <p className="text-muted-foreground">
        Can&apos;t see it? Have a look in spam or promotions. It can take a
        minute or two.
      </p>
      <p>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
        >
          Back to log in
        </Link>
      </p>
    </div>
  );
}

async function Message({
  searchParams,
}: Pick<PageProps<"/check-email">, "searchParams">) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "your inbox";
  const isReset = params.for === "reset";

  return (
    <header className="space-y-2">
      <h1 className="text-3xl">Check your email</h1>
      <p>
        {isReset
          ? `If ${email} has a Tend account, a link to reset your password is on its way.`
          : `We've sent a link to ${email}. Tap it to confirm your account, then you're in.`}
      </p>
    </header>
  );
}
