import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExtendedSearchFields } from "../ExtendedSearchFields";
import { act, render, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { OrganizationSorted, StateList } from "@/types/types";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("External Search Filter Test", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  const getFormData = (container: HTMLElement): FormData => {
    const form = container.querySelector("form");
    return new FormData(form!);
  };

  // adding filters that are hidden for easier testing
  const addFilter = async (name: string, user: UserEvent) => {
    const button = screen.getByRole("button", { name, hidden: true });
    await act(() => user.click(button));
  };

  it("should handle adding and removing a filter", async () => {
    const user = userEvent.setup();
    render(<ExtendedSearchFields searchParams={{}} />);

    //list with Filters not available as dropdown is closed
    expect(screen.queryByRole("list", { name: "Filter Optionen" })).toBeNull();

    // clicking on button
    const add = screen.getByRole("button", { name: /suchfeld hinzufügen/i });
    await act(() => user.click(add));

    const filterList = screen.getByRole("list", { name: "Filter Optionen" });
    expect(filterList).toBeDefined();

    // should be 19 filter options
    expect(within(filterList).getAllByRole("listitem")).toHaveLength(19);

    // adding a filter from within the list, expecting it not to be there anymore
    await act(() => user.click(within(filterList).getByText("Bund oder Land")));
    expect(within(filterList).getAllByRole("listitem")).toHaveLength(18);
    expect(within(filterList).queryByText("Bund oder Land")).toBeNull();

    // removing the added filter
    const removeButton = screen.getByRole("button", {
      name: /suchfeld „Bund oder Land“ entfernen/i,
    });
    // removing filter and expecting it to be in list again
    await act(() => user.click(removeButton));
    await act(() => user.click(add));
    expect(within(filterList).getAllByRole("listitem")).toHaveLength(19);
    expect(within(filterList).getByText("Bund oder Land")).toBeDefined();
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

  it("should set correct param on Typ", async () => {
    const user = userEvent.setup();
    const { container } = render(<ExtendedSearchFields searchParams={{}} />);
    const filterName = "Typ";

    await addFilter("Typ", user);
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
    await act(() => user.type(input, "Test1, Tag2, Und noch eins"));

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

  it("should set correct param on Bund oder Land", async () => {
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
      { id: "0123-456", name: "1", displayName: "Datahub", title: "ein Title" },
      { id: "999-555", name: "2", displayName: "GovData", title: "ein Title" },
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
});
