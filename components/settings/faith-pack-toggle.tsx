"use client";

import { useState, useTransition } from "react";
import { setFaithPack } from "@/app/(app)/about-me/actions";
import { ShareSwitch } from "@/components/about-me/about-me-flow";

/** Faith pack (F10): off by default, each partner chooses for themselves. */
export function FaithPackToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [error, setError] = useState<string>();
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <ShareSwitch
        label={on ? "Faith pack is on" : "Faith pack is off"}
        on={on}
        onChange={() => {
          const next = !on;
          setOn(next);
          setError(undefined);
          startTransition(async () => {
            const result = await setFaithPack(next);
            if (!result.ok) {
              setOn(!next);
              setError(result.error);
            }
          });
        }}
      />
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
