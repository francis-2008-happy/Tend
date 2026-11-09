import Link from "next/link";
import { LeafSprig } from "@/components/leaf-sprig";
import { TendMark } from "@/components/tend-mark";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-x-clip px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-10">
      <LeafSprig className="absolute top-4 -right-3 size-28 text-tender" />
      <Link
        href="/"
        className="mb-8 inline-flex min-h-11 items-center gap-2 self-start font-heading text-2xl text-primary"
      >
        <TendMark className="size-9" />
        Tend
      </Link>
      <main className="relative flex-1">{children}</main>
    </div>
  );
}
