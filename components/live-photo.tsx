"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * A big photo that gently comes alive: the still shows first, then a short
 * silent clip plays on top. Phones set to reduce motion or save data only
 * ever get the still, so modest Android phones stay fast.
 */
export function LivePhoto({
  src,
  clip,
  alt,
  priority,
  className,
}: {
  src: string;
  clip?: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const motionOk = useSyncExternalStore(subscribe, canPlay, () => false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 640px) 32rem, 100vw"
        className="object-cover"
      />
      {clip && motionOk ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={clip}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

const reduceMotion = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(reduceMotion);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function canPlay() {
  if (typeof window.matchMedia !== "function") return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return !window.matchMedia(reduceMotion).matches && !connection?.saveData;
}
