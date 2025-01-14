import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { CopyToClipboardButton } from "@/app/_components/Button/CopyToClipboardButton";

vi.mock("@/app/_lib/hooks/useTooltip", () => ({
  useTooltip: () => React.createRef(),
}));

describe("CopyToClipboardButton", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const copyResourceLinkText = "Ressourcenlink in Zwischenablage kopieren";
  const copiedText = "Kopiert";

  it("should display success message after click and then reset", async () => {
    const url = "https://www.example.com";
    const user = userEvent.setup();
    render(<CopyToClipboardButton url={url} />);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("title", copyResourceLinkText);
    await user.click(button);
    await waitFor(() => expect(button).toHaveAttribute("title", copiedText));
    await vi.advanceTimersByTimeAsync(1900);
    await waitFor(() =>
      expect(button).toHaveAttribute("title", copyResourceLinkText),
    );
  });
});
