import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelectEndpoint } from "./SelectEndpoint";

describe("SelectFormat", () => {
  it("should render correctly", () => {
    render(<SelectEndpoint value="ds" onChange={vi.fn()} />);

    screen.getByText(/endpunkt/i);
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });
});
