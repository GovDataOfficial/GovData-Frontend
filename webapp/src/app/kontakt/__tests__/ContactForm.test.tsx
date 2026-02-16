import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { isFeatureEnabled } from "@/app/_lib/features";

import { ContactForm } from "../ContactForm";

vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(() => true),
}));

describe("Contact Page", () => {
  beforeAll(() => {
    vi.stubEnv("mail_smtp_to_address", "foo@test.de");
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render two mail adress inputs for honeypot ", () => {
    render(<ContactForm mailAdress="foo@test.de" />);

    const emailInputs = screen.getAllByRole("textbox", {
      name: "E-Mail-Adresse",
    });

    expect(emailInputs).toHaveLength(2);

    expect(emailInputs[0]).toHaveAttribute("name", "mail");
    expect(emailInputs[1]).toHaveAttribute("name", "mail2");
  });

  it("should render privacy policy consent when enabled", () => {
    render(<ContactForm mailAdress="foo@test.de" />);

    const privacyPolicy = screen.getByRole("checkbox", {
      name: /Ich willige in die genannte Verarbeitung meiner personenbezogenen Daten ein/i,
    });

    expect(privacyPolicy).toBeInTheDocument();
    expect(privacyPolicy).toBeRequired();
  });

  it("should not render privacy policy consent when disabled", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    render(<ContactForm mailAdress="foo@test.de" />);

    const privacyPolicy = screen.queryByRole("checkbox");
    expect(privacyPolicy).not.toBeInTheDocument();
  });
});
