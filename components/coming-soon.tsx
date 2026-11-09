import type { LucideIcon } from "lucide-react";
import { TendCard } from "@/components/tend-card";

/** Gentle placeholder for areas that are built in later phases. */
export function ComingSoon({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <TendCard tone="calm" className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg">{title}</h2>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </TendCard>
  );
}
