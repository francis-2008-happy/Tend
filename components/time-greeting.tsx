"use client";

import { useSyncExternalStore } from "react";

export function greetingFor(hour: number) {
  if (hour < 5) return "Hello";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const noSubscribe = () => () => {};

/**
 * "Good evening, Tolu" using the phone's own clock. The server doesn't know
 * the phone's time, so it says "Hello" until the page is running.
 */
export function TimeGreeting({ name }: { name?: string | null }) {
  const greeting = useSyncExternalStore(
    noSubscribe,
    () => greetingFor(new Date().getHours()),
    () => "Hello",
  );
  return (
    <h1 className="text-4xl leading-tight">
      {greeting}
      {name ? `, ${name}` : ""}
    </h1>
  );
}
