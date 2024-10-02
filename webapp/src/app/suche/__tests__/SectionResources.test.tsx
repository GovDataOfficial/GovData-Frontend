import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionResources } from "@/app/suche/_components/SectionResources";
import { metaDataTestProps } from "@/app/suche/__tests__/props";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
  usePathname: vi.fn().mockReturnValue({
    getAll: vi.fn(),
  }),
  useRouter: vi.fn(),
}));

describe("SectionResources", () => {
  const emptyResourceData = Object.assign({}, metaDataTestProps, {
    resources: [],
  });

  const undefinedResourceData = Object.assign({}, metaDataTestProps, {
    resources: undefined,
  });

  it("should render null if resources are empty", () => {
    const { container } = render(<SectionResources data={emptyResourceData} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render null if resources undefined", () => {
    const { container } = render(
      <SectionResources data={undefinedResourceData} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  //todo
  it.skip("should render table for desktop and mobile view", () => {
    const { container } = render(<SectionResources data={metaDataTestProps} />);
    screen.getByRole("heading", {
      name: /ressourcen und datenlinks/i,
      level: 2,
    });

    const tableForDesktop = screen.getByRole("table");
    expect(tableForDesktop).toBeInTheDocument();

    const listForMobileView = container.querySelector(".d-block.d-md-none");
    expect(listForMobileView).toBeInTheDocument();
  });
});
