import Link from "next/link";
import { TendMark } from "@/components/tend-mark";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-10">
      <Link
        href="/"
        className="mb-8 inline-flex min-h-11 items-center gap-2 self-start font-heading text-2xl text-primary"
      >
        <TendMark className="size-9" />
        Tend
      </Link>
      <main className="flex-1">{children}</main>
    </div>
  );
}
