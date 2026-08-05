import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { isFeatureEnabled } from "@/app/_lib/features";
import { OrganizationSorted, StateList } from "@/types/types";

import { ExtendedSearchFields } from "../ExtendedSearchFields";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(() => true),
}));

describe("External Search Filter Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
    // Mock all feature flags as enabled by default
    vi.mocked(isFeatureEnabled).mockImplementation((feature) => {
      return true; // Enable all features by default
    });
  });

  const getFormData = (container: HTMLElement): FormData => {
    const form = container.querySelector("form");
    return new FormData(form!);
  };

  // adding filters that are hidden for easier testing
  const addFilter = async (name: string, user: UserEvent) => {
    const button = screen.getByRole("button", { name, hidden: true });
    await user.click(button);
  };

  it("should handle adding and removing a filter", async () => {
    const user = userEvent.setup();
    render(<ExtendedSearchFields searchParams={{}} />);

    //list with Filters not available as dropdown is closed
    expect(screen.queryByRole("list", { name: "Filter Optionen" })).toBeNull();

    // clicking on button
    const add = screen.getByRole("button", { name: /suchfeld hinzufügen/i });
    await user.click(add);

    const filterList = screen.getByRole("list", { name: "Filter Optionen" });
    expect(filterList).toBeDefined();

    // The count depends on feature flags at module level
    const initialItemCount = within(filterList).getAllByRole("listitem").length;
    expect(initialItemCount).toBeGreaterThanOrEqual(16);

    // adding a filter from within the list, expecting it not to be there anymore
    // Use "Titel" which is always available
    await user.click(within(filterList).getByText("Titel"));

    // Re-open the dropdown to check the updated count
    await user.click(add);
    const updatedFilterList = screen.getByRole("list", {
      name: "Filter Optionen",
    });
    expect(
      within(updatedFilterList).getAllByRole("listitem", { hidden: true }),
    ).toHaveLength(initialItemCount - 1);
    expect(within(updatedFilterList).queryByText("Titel")).toBeNull();

    // removing the added filter
    const removeButton = screen.getByRole("button", {
      name: /titel.*entfernen/i,
    });
    // removing filter and expecting it to be in list again
    await user.click(removeButton);
    await user.click(add);
    const finalFilterList = screen.getByRole("list", {
      name: "Filter Optionen",
    });
    expect(
      within(finalFilterList).getAllByRole("listitem", { hidden: true }),
    ).toHaveLength(initialItemCount);
    expect(within(finalFilterList).getByText("Titel")).toBeDefined();
  });

  it("should set correct param on einfache suche", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExtendedSearchFields searchParams={{}} />);
    const filterName = "Einfache Suche";

    await addFilter(filterName, user);
    const input = screen.getByRole("textbox", { name: "in " + filterName });
    expect(document.activeElement).toBe(input);

    await user.type(input, "test123");
    const formData = getFormData(container);
    expect(formData.get("q")).toEqual("test123");
  });

  it("should set correct param on Typen", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExtendedSearchFields searchParams={{}} />);
    const filterName = "Typen";

    await addFilter("Typen", user);
    const select = screen.getByRole("combobox", { name: "in " + filterName });
    expect(document.activeElement).toBe(select);

    await user.selectOptions(select, "Anwendungen");
    const formData = getFormData(container);
    expect(formData.get("type")).toEqual("showcase");
  });

  it("should set correct param on Schlagwörter", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExtendedSearchFields searchParams={{}} />);
    const filterName = "Schlagwörter";

    await addFilter(filterName, user);
    const input = screen.getByRole("textbox", { name: "in " + filterName });

    expect(document.activeElement).toBe(input);
    await user.type(input, "Test1, Tag2, Und noch eins");

    const formData = getFormData(container);

    const allFilterInputs = formData.getAll("tags");
    expect(allFilterInputs).toHaveLength(3);
    expect(allFilterInputs[0]).toEqual("test1");
    expect(allFilterInputs[1]).toEqual("tag2");
    expect(allFilterInputs[2]).toEqual("und noch eins");
  });

  it("should set correct param on Offenheit der Lizenz", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExtendedSearchFields searchParams={{}} />);
    const filterName = "Offenheit der Lizenz";

    await addFilter("Offenheit der Lizenz", user);
    const select = screen.getByRole("combobox", { name: "in " + filterName });
    expect(document.activeElement).toBe(select);

    await user.selectOptions(select, "Eingeschränkte Nutzung");

    const formData = getFormData(container);
    expect(formData.get("openness")).toEqual("has_closed");
  });

  it("should set correct param on Datenservices", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExtendedSearchFields searchParams={{}} />);
    const filterName = "Datenservices";

    await addFilter(filterName, user);
    const checkbox = screen.getByRole("checkbox", {
      name: /nur datensätze mit datenservices/i,
    });
    expect(document.activeElement).toBe(checkbox);

    await user.click(checkbox);
    const formData = getFormData(container);
    expect(formData.get("dataservice")).toEqual("has_data_service");
  });

  it("should set correct param on Bund oder Land (requires region search feature)", async () => {
    // This test requires the showRegionSearch feature to be enabled

    // Import the component with the disabled feature flag
    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const stateListMock: StateList = [
      { id: "00", name: "Erstes Bundes Land" },
      { id: "01", name: "Ein weiteres Bundes Land" },
    ];

    const user = userEvent.setup();
    const { container } = render(
      <ExtendedSearchFields searchParams={{}} stateList={stateListMock} />,
    );
    const filterName = "Bund oder Land";
    await addFilter(filterName, user);

    const select = screen.getByRole("combobox", { name: "in " + filterName });
    expect(document.activeElement).toBe(select);

    await user.selectOptions(select, "Ein weiteres Bundes Land");

    const formData = getFormData(container);
    expect(formData.get("state")).toEqual("01");
  });

  it("should set correct param on Datenbereitsteller", async () => {
    const organizationMock: OrganizationSorted = [
      {
        id: "0123-456",
        name: "1",
        displayName: "Datahub",
        title: "ein Title",
        contributorIds: [],
      },
      {
        id: "999-555",
        name: "2",
        displayName: "GovData",
        title: "ein Title",
        contributorIds: [],
      },
    ];

    const user = userEvent.setup();
    const { container } = render(
      <ExtendedSearchFields
        searchParams={{}}
        organizationSorted={organizationMock}
      />,
    );
    const filterName = "Datenbereitsteller";
    await addFilter(filterName, user);

    const select = screen.getByRole("combobox", { name: "in " + filterName });
    expect(document.activeElement).toBe(select);

    await user.selectOptions(select, "GovData");

    const formData = getFormData(container);
    expect(formData.get("sourceportal")).toEqual("999-555");
  });

  it("should show all 4 types when disabledFilterTypes is empty", async () => {
    vi.resetModules();

    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const user = userEvent.setup();
    render(<ExtendedSearchFields searchParams={{}} disabledFilterTypes="" />);

    await addFilter("Typen", user);
    const select = screen.getByRole("combobox", { name: "in Typen" });
    const options = within(select).getAllByRole("option");

    expect(options).toHaveLength(4);
    expect(options.map((o) => o.textContent)).toContain("Daten");
    expect(options.map((o) => o.textContent)).toContain("Anwendungen");
    expect(options.map((o) => o.textContent)).toContain("Informationen");
    expect(options.map((o) => o.textContent)).toContain("Blog-Beiträge");
  });

  it("should hide blog type when disabledFilterTypes contains 'blog'", async () => {
    vi.resetModules();

    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const user = userEvent.setup();
    render(
      <ExtendedSearchFields searchParams={{}} disabledFilterTypes="blog" />,
    );

    await addFilter("Typen", user);
    const select = screen.getByRole("combobox", { name: "in Typen" });
    const options = within(select).getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options.map((o) => o.textContent)).toContain("Daten");
    expect(options.map((o) => o.textContent)).toContain("Anwendungen");
    expect(options.map((o) => o.textContent)).toContain("Informationen");
    expect(options.map((o) => o.textContent)).not.toContain("Blog-Beiträge");
  });

  it("should hide multiple types when disabledFilterTypes contains comma-separated keys", async () => {
    vi.resetModules();

    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const user = userEvent.setup();
    render(
      <ExtendedSearchFields
        searchParams={{}}
        disabledFilterTypes="blog,article"
      />,
    );

    await addFilter("Typen", user);
    const select = screen.getByRole("combobox", { name: "in Typen" });
    const options = within(select).getAllByRole("option");

    expect(options).toHaveLength(2);
    expect(options.map((o) => o.textContent)).toContain("Daten");
    expect(options.map((o) => o.textContent)).toContain("Anwendungen");
    expect(options.map((o) => o.textContent)).not.toContain("Informationen");
    expect(options.map((o) => o.textContent)).not.toContain("Blog-Beiträge");
  });
});

describe("External Search Filter Test - Feature Flag Disabled", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should not include state filter if showRegionSearch feature is disabled", async () => {
    // Mock feature flags: disable region search, enable others
    vi.mocked(isFeatureEnabled).mockImplementation((feature) => {
      if (feature === "showRegionSearch") {
        return false;
      }
      return true;
    });

    vi.resetModules();

    // Re-import the component with the new mock implementation
    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const user = userEvent.setup();
    render(<ExtendedSearchFields searchParams={{}} />);

    const add = screen.getByRole("button", { name: /suchfeld hinzufügen/i });
    await user.click(add);

    const filterList = screen.getByRole("list", { name: "Filter Optionen" });
    expect(filterList).toBeDefined();

    // Should not include "Bund oder Land" (state) filter
    expect(screen.queryByRole("button", { name: "Bund oder Land" })).toBeNull();
  });

  it("should have correct count when showRegionSearch feature is enabled", async () => {
    // Mock feature flags: enable region search, disable showcase
    vi.mocked(isFeatureEnabled).mockImplementation((feature) => {
      if (feature === "showRegionSearch") {
        return true;
      }
      if (feature === "showcasesEnabled") {
        return false;
      }
      return true;
    });

    // Reset the module cache to force re-evaluation of the filterItems array
    vi.resetModules();

    // Re-import the component with the new mock implementation
    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const user = userEvent.setup();
    render(<ExtendedSearchFields searchParams={{}} />);

    const add = screen.getByRole("button", { name: /suchfeld hinzufügen/i });
    await user.click(add);

    const filterList = screen.getByRole("list", { name: "Filter Optionen" });
    expect(filterList).toBeDefined();

    expect(within(filterList).getAllByRole("listitem")).toHaveLength(17);
  });

  it("should not include filter showcase_types and platforms if showcasesEnabled feature is disabled", async () => {
    vi.mocked(isFeatureEnabled).mockImplementation((feature) => {
      if (feature === "showcasesEnabled") {
        return false;
      }
      if (feature === "showRegionSearch") {
        return true;
      }
      return true;
    });

    // Reset the module cache to force re-evaluation of the filterItems array
    vi.resetModules();

    // Re-import the component with the new mock implementation
    const { ExtendedSearchFields } = await import("../ExtendedSearchFields");

    const user = userEvent.setup();
    render(<ExtendedSearchFields searchParams={{}} />);

    const add = screen.getByRole("button", { name: /suchfeld hinzufügen/i });
    await user.click(add);

    const filterList = screen.getByRole("list", { name: "Filter Optionen" });
    expect(filterList).toBeDefined();

    expect(within(filterList).getAllByRole("listitem")).toHaveLength(17);
    expect(within(filterList).queryByText("Anwendungstypen")).toBeNull();
    expect(within(filterList).queryByText("Systeme")).toBeNull();
  });
});
