// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../contact/route";
import { redirect } from "next/navigation";

// @ts-expect-error no typings for nodemailer
import nodemailer from "nodemailer";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue("ok"),
    }),
  },
}));

describe("api/contact", () => {
  const url = new URL("https://test.de");

  const sendMailMock = vi.mocked(nodemailer).createTransport().sendMail;

  beforeEach(() => {
    vi.stubEnv("mail_enabled", "true");
    vi.stubEnv("mail_smtp_from_address", "von@system.de");
    vi.stubEnv("mail_smtp_to_address", "an@irgendwen.de");
    vi.clearAllMocks();
  });

  it("should not call sendmail if honeypot mail is filled out", async () => {
    const requestWithHoneyPot = new Request(url, {
      method: "POST",
      body: "mail=honey@pot.de",
    });

    await POST(requestWithHoneyPot);

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(vi.mocked(redirect)).toHaveBeenCalledWith("/kontakt/ok");
  });

  it("should call sendmail if all required fields are available", async () => {
    const requestWithAllRequiredFields = new Request(url, {
      method: "POST",
      body: "mail2=real@mail.de&message=nachricht&name=&title=",
    });

    await POST(requestWithAllRequiredFields);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: "von@system.de",
      to: "an@irgendwen.de",
      subject: "Kontaktformular (real@mail.de)",
      text:
        `Anrede: Keine Angabe\n` +
        `Name: Keine Angabe\n` +
        `E-Mail-Adresse: real@mail.de\n\n` +
        `Was möchten Sie uns mitteilen?:\n\nnachricht`,
    });
    expect(vi.mocked(redirect)).toHaveBeenCalledWith("/kontakt/ok");
  });

  it("should not call sendmail if required fields are missing", async () => {
    const requestWithMissingRequiredFields = new Request(url, {
      method: "POST",
      body: "mail2=&message=",
    });

    await POST(requestWithMissingRequiredFields);

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(vi.mocked(redirect)).toHaveBeenCalledWith("/kontakt/ok");
  });

  it("should not call sendmail if mail_enabled env is not true", async () => {
    vi.stubEnv("mail_enabled", "false");

    const requestWithAllRequiredFields = new Request(url, {
      method: "POST",
      body: "mail2=real@mail.de&message=nachricht&name=&title=",
    });

    await POST(requestWithAllRequiredFields);

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(vi.mocked(redirect)).not.toHaveBeenCalled();
  });
});
