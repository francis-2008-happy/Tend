import type { Metadata } from "next";
import { TendMark } from "@/components/tend-mark";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <TendMark className="size-14" />
      <h1 className="text-3xl">You&apos;re offline</h1>
      <p className="max-w-xs text-muted-foreground">
        Tend will be right here when you&apos;re back. A good moment to put the
        phone down together.
      </p>
    </main>
  );
}
