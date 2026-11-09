"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { clearDeviceData } from "@/lib/auth/clear-device";
import { logOut } from "../../(auth)/actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="lg"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logOut();
          await clearDeviceData();
          // Full reload so nothing from this session stays in memory.
          window.location.replace("/");
        })
      }
    >
      <LogOut aria-hidden="true" />
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}
