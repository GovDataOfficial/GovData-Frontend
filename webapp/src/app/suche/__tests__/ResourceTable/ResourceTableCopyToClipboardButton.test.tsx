import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ResurceTableCopyToClipboardButton } from "@/app/suche/_components/ResourceTable/ResourceTableCopyToClipboardButton";

vi.mock("@/app/_lib/hooks/useTooltip", () => ({
  useTooltip: () => React.createRef(),
}));

describe("ResurceTableCopyToClipboardButton", () => {
  const copiedLinkText = "Ressourcenlink in Zwischenablage kopieren";
  const copiedText = "Kopiert";

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should display success message after click and then reset", async () => {
    const url = "https://www.example.com";
    const user = userEvent.setup();
    render(<ResurceTableCopyToClipboardButton url={url} />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(copiedLinkText);
    await user.click(button);
    await waitFor(() => expect(button).toHaveTextContent(copiedText));
    await vi.advanceTimersByTimeAsync(1900);
    await waitFor(() => expect(button).toHaveTextContent(copiedLinkText));
  });
});
