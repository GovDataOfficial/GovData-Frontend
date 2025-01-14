import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MetadataOrganizationError } from "@/app/datenpflege/_components/MetadataOrganizationError";

describe("MetadataOrganizationError", () => {
  beforeEach(() => {
    vi.stubEnv("mail_fitko", "test@foo.de");
  });

  test("should render the error message", () => {
    render(<MetadataOrganizationError />);
    screen.getByText(/warum werden mir keine informationen angezeigt\?/i);
    const link = screen.getByRole("link", { name: "test@foo.de" });

    expect(link).toHaveAttribute("href", "mailto:test@foo.de");
  });
});
