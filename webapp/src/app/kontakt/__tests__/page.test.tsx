import { beforeAll, describe, expect, it, vi } from "vitest";
import ContactPage from "../page";
import { render, screen } from "@testing-library/react";

describe("Contact Page", () => {
  beforeAll(() => {
    vi.stubEnv("mail_enabled", "true");
    vi.stubEnv("mail_smtp_to_address", "foo@test.de");
  });

  it("should set correct h1 for page", () => {
    render(<ContactPage />);
    screen.getByRole("heading", { name: "Kontakt", level: 1 });
  });

  it("should set correct mailto info from process.env", () => {
    render(<ContactPage />);

    const link = screen.getByRole("link", {
      name: "die Redaktion des Betreibers.",
    });

    expect(link).toHaveAttribute("href", "mailto:foo@test.de");
    expect(
      screen.getByText(/was möchten sie uns mitteilen\?/i),
    ).toBeInTheDocument();
  });

  it("should not show contactform", () => {
    vi.stubEnv("mail_enabled", "false");
    render(<ContactPage />);

    // link and text should be visible anyway
    screen.getByRole("link", { name: "die Redaktion des Betreibers." });
    // but no contact form
    expect(
      screen.queryByText(/was möchten sie uns mitteilen\?/i),
    ).not.toBeInTheDocument();
  });
});
