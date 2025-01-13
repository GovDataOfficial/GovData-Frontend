import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MetaDataOrganizationError } from "@/app/datenpflege/_components/MetaDataOrganizationError";

describe("MetaDataOrganizationError", () => {
  beforeEach(() => {
    vi.stubEnv("mail_fitko", "test@foo.de");
  });

  test("should render the error message", () => {
    render(<MetaDataOrganizationError />);
    screen.getByText(/warum werden mir keine informationen angezeigt\?/i);
    const link = screen.getByRole("link", { name: "test@foo.de" });

    expect(link).toHaveAttribute("href", "mailto:test@foo.de");
  });
});
