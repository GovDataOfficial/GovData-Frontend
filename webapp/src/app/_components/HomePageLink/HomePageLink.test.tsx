import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { HomePageLink } from "@/app/_components/HomePageLink/HomePageLink";

describe("Homepagelink", () => {
  it("should render correct markup", () => {
    render(<HomePageLink />);

    screen.getByText("Hier geht es");
    const link = screen.getByRole("link");

    expect(link.textContent).toMatch(/^zur Startseite von /);
    expect(link).toHaveAttribute("href", "/");
  });
});
