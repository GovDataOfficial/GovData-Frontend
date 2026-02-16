import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import NotFoundPage from "../not-found";

describe("not-found", () => {
  it("should render correct heading", () => {
    render(<NotFoundPage />);

    screen.getByRole("heading", {
      name: "Seite nicht gefunden",
      level: 1,
    });
  });

  it("should render correct text", () => {
    render(<NotFoundPage />);
    screen.getByText(/Die aufgerufene Seite existiert nicht./i);
  });

  it("should render link to home page", () => {
    render(<NotFoundPage />);
    const link = screen.getByRole("link", {
      name: /^zur Startseite von/i,
    });
    expect(link).toHaveAttribute("href", "/");
  });
});
