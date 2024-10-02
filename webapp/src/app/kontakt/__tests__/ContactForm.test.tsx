import { beforeAll, describe, expect, it, vi } from "vitest";
import { ContactForm } from "../ContactForm";
import { render, screen } from "@testing-library/react";

describe("Contact Page", () => {
  beforeAll(() => {
    vi.stubEnv("mail_smtp_to_address", "foo@test.de");
  });

  it("should render two mail adress inputs for honeypot ", () => {
    render(<ContactForm />);

    const emailInputs = screen.getAllByRole("textbox", {
      name: "E-Mail-Adresse",
    });

    expect(emailInputs).toHaveLength(2);

    expect(emailInputs[0]).toHaveAttribute("name", "mail");
    expect(emailInputs[1]).toHaveAttribute("name", "mail2");
  });
});
