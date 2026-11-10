import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutMeFlow } from "@/components/about-me/about-me-flow";
import { getMyAboutMe } from "@/lib/about-me";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyCouple } from "@/lib/couple";

export const metadata: Metadata = { title: "About me" };

/** Private onboarding (F4): warm, skippable, saved as you go. */
export default function AboutMePage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  return (
    <Suspense fallback={<div className="-mx-5 h-[42vh] min-h-64 bg-muted" />}>
      <Flow searchParams={searchParams} />
    </Suspense>
  );
}

async function Flow({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const user = await getCurrentUser();
  const [initial, couple, { start }] = await Promise.all([
    getMyAboutMe(),
    getMyCouple(user.id),
    searchParams,
  ]);
  return (
    <AboutMeFlow
      initial={initial}
      partnerName={couple.state === "linked" ? couple.partnerName : null}
      start={start === "finish" && initial ? "finish" : "intro"}
    />
  );
}
