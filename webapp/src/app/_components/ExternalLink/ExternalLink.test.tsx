import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it("should render correctly", () => {
    render(<ExternalLink title="Link Titel" href="/external_url" />);

    const link = screen.getByRole("link", { name: /link titel/i });

    expect(link.getAttribute("href")).toContain("/external_url");
    expect(link).toHaveProperty("target", "_blank");
  });
});
