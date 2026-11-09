import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("placeholder home page", () => {
  it("shows the app name and tagline", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Tend" })).toBeInTheDocument();
    expect(screen.getByText("Tend to each other.")).toBeInTheDocument();
  });
});
