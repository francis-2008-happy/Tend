import Link from "next/link";
import { LivePhoto } from "@/components/live-photo";
import { TendMark } from "@/components/tend-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Public welcome screen. Signed-in visitors are sent to /home by proxy.ts. */
export default function WelcomePage() {
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-x-clip pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="relative">
        <LivePhoto
          src="/photos/balcony.webp"
          clip="/clips/welcome.mp4"
          alt="A couple laughing together on a balcony at sunset"
          priority
          className="h-[56vh] min-h-80 w-full"
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <span className="absolute top-[max(1.25rem,env(safe-area-inset-top))] left-6 inline-flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 font-heading text-xl text-primary shadow-soft backdrop-blur">
          <TendMark className="size-7" />
          Tend
        </span>
      </div>
      <div className="relative -mt-8 flex flex-1 flex-col gap-6 px-6">
        <div className="space-y-3">
          <h1 className="text-5xl leading-[1.05]">
            Tend to{" "}
            <span className="text-terracotta-deep italic">each other.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Don&apos;t just manage your marriage. Enjoy it. Plan something
            lovely, put the phone down, and keep the memory.
          </p>
        </div>
        <div className="mt-auto space-y-3">
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
      </div>
    </main>
  );
}
