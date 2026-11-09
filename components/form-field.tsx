"use client";

import { type ComponentProps, useId } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Labelled input with its error message linked for screen readers. */
export function FormField({
  label,
  error,
  hint,
  className,
  ...input
}: ComponentProps<"input"> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base transition outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
        {...input}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Message shown above a form, announced politely to screen readers. */
export function FormMessage({ children }: { children?: string }) {
  return (
    <div aria-live="polite">
      {children ? (
        <p className="rounded-xl bg-terracotta-soft px-4 py-3 text-foreground">
          {children}
        </p>
      ) : null}
    </div>
  );
}

/** Full-width submit button that shows a gentle pending state. */
export function SubmitButton({
  children,
  pendingText,
}: {
  children: string;
  pendingText: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
