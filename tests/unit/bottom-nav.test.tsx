import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

let pathname = "/home";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const { BottomNav, NAV_TABS, isTabActive } =
  await import("@/components/bottom-nav");

describe("bottom navigation", () => {
  it("has the five tabs from the plan, each with a visible label", () => {
    render(<BottomNav />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual([
      "Home",
      "Connect",
      "Plan",
      "Us",
      "Garden",
    ]);
  });

  it("marks the current tab, including pages inside it", () => {
    pathname = "/plan/dates";
    render(<BottomNav />);
    expect(screen.getByRole("link", { name: "Plan" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("does not confuse similar paths", () => {
    expect(isTabActive("/homework", "/home")).toBe(false);
    expect(NAV_TABS).toHaveLength(5);
  });
});
