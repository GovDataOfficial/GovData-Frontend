import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AlertBadge } from "@/app/_components/AlertBadge/AlertBadge";

describe("AlertBadge", () => {
  it("should render an alert", () => {
    render(<AlertBadge>hilfe</AlertBadge>);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("hilfe");
  });
});
