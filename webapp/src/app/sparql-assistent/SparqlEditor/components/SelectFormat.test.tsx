import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelectFormat } from "./SelectFormat";

describe("SelectFormat", () => {
  it("should render correctly", () => {
    render(<SelectFormat value="text/csv,*/*;q=0.9" onChange={vi.fn()} />);

    screen.getByText(/ergebnisformat:/i);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });
});
