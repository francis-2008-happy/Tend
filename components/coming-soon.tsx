import type { LucideIcon } from "lucide-react";
import { ACCENTS, type Accent } from "@/components/accents";
import { TendCard } from "@/components/tend-card";
import { cn } from "@/lib/utils";

/** Gentle placeholder for areas that are built in later phases. */
export function ComingSoon({
  icon: Icon,
  title,
  accent = "sage",
  children,
}: {
  icon: LucideIcon;
  title: string;
  accent?: Accent;
  children: React.ReactNode;
}) {
  const colours = ACCENTS[accent];
  return (
    <TendCard
      tone={colours.card}
      className="animate-bloom flex items-start gap-4"
    >
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-soft",
          colours.chip,
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg">{title}</h2>
        <p className="text-muted-foreground">{children}</p>
        <p className="pt-1 text-sm font-medium text-muted-foreground">
          Coming soon
        </p>
      </div>
    </TendCard>
  );
}
