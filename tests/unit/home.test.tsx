import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WelcomePage from "@/app/page";

describe("welcome screen", () => {
  it("shows the name, tagline and both ways in", () => {
    render(<WelcomePage />);
    expect(screen.getByText("Tend")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Tend to each other." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(
      screen.getByRole("link", { name: "I have an account" }),
    ).toHaveAttribute("href", "/login");
  });
});
