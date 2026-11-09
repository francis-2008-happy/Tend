"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

/**
 * A link between log in and sign up that keeps where the person was going
 * (for example a partner's invite), so it isn't lost on the way.
 */
export function KeepNextLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const next = useSearchParams().get("next");
  const target = next ? `${href}?next=${encodeURIComponent(next)}` : href;
  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}
