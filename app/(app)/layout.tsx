import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";

/**
 * Signed-in shell. Signed-out visitors are redirected by proxy.ts, and every
 * screen that shows personal data checks the session again on the server.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="mx-auto w-full max-w-md flex-1 overflow-x-clip px-5 pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
