import { describe, expect, it } from "vitest";
import { HomePageLink } from "@/app/_components/HomePageLink/HomePageLink";
import { render, screen } from "@testing-library/react";

describe("Homepagelink", () => {
  it("should render correct markup", () => {
    render(<HomePageLink />);

    screen.getByText("Hier geht es");
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("zur Startseite von GovData");
    expect(link).toHaveAttribute("href", "/");
  });
});
