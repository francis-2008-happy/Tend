import Image from "next/image";
import Link from "next/link";
import { TendMark } from "@/components/tend-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Public welcome screen. Signed-in visitors are sent to /home by proxy.ts. */
export default function WelcomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <TendMark className="size-20" />
        <div className="space-y-3">
          <h1 className="text-5xl">Tend</h1>
          <p className="font-heading text-xl text-primary italic">
            Tend to each other.
          </p>
        </div>
        <p className="max-w-xs text-muted-foreground">
          Don&apos;t just manage your marriage. Enjoy it. Plan something lovely,
          put the phone down, and keep the memory.
        </p>
        <div className="flex items-end gap-1" aria-hidden="true">
          <Image
            src="/garden/flower.svg"
            alt=""
            width={56}
            height={56}
            priority
          />
          <Image
            src="/garden/tree.svg"
            alt=""
            width={96}
            height={96}
            priority
          />
          <Image
            src="/garden/flower.svg"
            alt=""
            width={44}
            height={44}
            priority
          />
        </div>
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
