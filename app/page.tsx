import Link from "next/link";
import { GardenStrip } from "@/components/garden-strip";
import { LeafSprig } from "@/components/leaf-sprig";
import { TendMark } from "@/components/tend-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Public welcome screen. Signed-in visitors are sent to /home by proxy.ts. */
export default function WelcomePage() {
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-x-clip px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <LeafSprig className="absolute top-6 -right-2 size-32 text-tender" />
      <LeafSprig className="absolute top-40 -left-8 size-24 -scale-x-100 text-milestone" />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <TendMark className="size-20" />
        <div className="space-y-3">
          <h1 className="text-5xl">Tend</h1>
          <p className="font-heading text-2xl text-terracotta-deep italic">
            Tend to each other.
          </p>
        </div>
        <p className="max-w-xs text-muted-foreground">
          Don&apos;t just manage your marriage. Enjoy it. Plan something lovely,
          put the phone down, and keep the memory.
        </p>
        <GardenStrip className="max-w-xs" priority fadeEdges />
      </div>
      <div className="space-y-3">
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
          Get started
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          I have an account
        </Link>
      </div>
    </main>
  );
}
