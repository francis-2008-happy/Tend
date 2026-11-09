"use client";

import {
  BookOpen,
  CalendarDays,
  House,
  MessageCircle,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_TABS = [
  { href: "/home", label: "Home", icon: House, pill: "bg-sage-soft" },
  {
    href: "/connect",
    label: "Connect",
    icon: MessageCircle,
    pill: "bg-tender-soft",
  },
  {
    href: "/plan",
    label: "Plan",
    icon: CalendarDays,
    pill: "bg-terracotta-soft",
  },
  { href: "/us", label: "Us", icon: BookOpen, pill: "bg-milestone-soft" },
  { href: "/garden", label: "Garden", icon: Sprout, pill: "bg-sage-soft" },
] as const;

export function isTabActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The five-tab bottom navigation from plan section 7. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md">
        {NAV_TABS.map(({ href, label, icon: Icon, pill }) => {
          const active = isTabActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                    active && pill,
                  )}
                >
                  <Icon
                    className="size-6"
                    strokeWidth={active ? 2.25 : 1.75}
                    aria-hidden="true"
                  />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
