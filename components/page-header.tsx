import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ACCENTS, type Accent } from "@/components/accents";
import { LeafSprig } from "@/components/leaf-sprig";
import { cn } from "@/lib/utils";

/** Screen title with the area's own colour and a botanical touch. */
export function PageHeader({
  title,
  description,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  accent?: Accent;
  children?: ReactNode;
}) {
  const colours = accent ? ACCENTS[accent] : null;
  return (
    <header className="relative space-y-3 pt-8 pb-4">
      {colours ? (
        <LeafSprig
          className={cn("absolute -top-1 -right-3 size-28", colours.text)}
        />
      ) : null}
      {Icon && colours ? (
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl shadow-soft",
            colours.chip,
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <h1 className="relative text-4xl leading-tight">{title}</h1>
      {description ? (
        <p className="relative max-w-[85%] text-lg text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}
