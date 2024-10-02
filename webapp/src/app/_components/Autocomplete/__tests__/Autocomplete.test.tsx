import { describe, expect, it } from "vitest";
import { AutocompleteListItem } from "@/app/_components/Autocomplete/AutocompleteListItem";
import { Autocomplete } from "@/app/_components/Autocomplete/Autocomplete";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Autocomplete", () => {
  const mockSuggestions = ["hallo", "wie", "geht"];

  function TestComponent() {
    return (
      <Autocomplete
        label="Mein label"
        placeholder="Mein Placeholder"
        fetchData={() => Promise.resolve(mockSuggestions)}
        onItemSelect={(item) => item}
      >
        {(suggestion, requiredListProps) => (
          <AutocompleteListItem key={suggestion} {...requiredListProps}>
            {suggestion}
          </AutocompleteListItem>
        )}
      </Autocomplete>
    );
  }

  const getSearchBox = () =>
    screen.getByRole("searchbox", { name: /mein label/i });

  const getSuggestionsContainer = (container: HTMLElement) =>
    container.querySelector(
      "#autocomplete-suggestion-container",
    ) as HTMLElement;

  it("should correctly label input", () => {
    render(<TestComponent />);
    const label = screen.getByText(/mein label/i);
    expect(label.classList).toContain("offscreen");
    const forId = label.getAttribute("for");

    const searchbox = getSearchBox();
    expect(searchbox.getAttribute("id")).toBe(forId);
  });

  it("should have correct attributes on searchbox", () => {
    render(<TestComponent />);

    const searchbox = getSearchBox();

    expect(searchbox.getAttribute("type")).toBe("search");
    expect(searchbox.getAttribute("placeholder")).toBe("Mein Placeholder");
    expect(searchbox.getAttribute("title")).toBe("Mein label");
    expect(searchbox.getAttribute("value")).toBe("");
    expect(searchbox.getAttribute("aria-controls")).toBe(
      "autocomplete-suggestion-container",
    );
  });

  it("should open suggestions list with live region message", async () => {
    const user = userEvent.setup();
    const { container } = render(<TestComponent />);

    const suggestionContainer = getSuggestionsContainer(container);
    expect(suggestionContainer.getAttribute("aria-hidden")).toBe("true");

    const searchbox = getSearchBox();
    await act(() => user.type(searchbox, "test"));
    await screen.findByRole("listbox");

    expect(suggestionContainer.getAttribute("aria-hidden")).toBe("false");

    const liveRegion = screen.getByRole("status");
    expect(liveRegion.textContent).toBe(
      "3 Vervollständigungs-Vorschläge wurden gefunden. Benutzen Sie die Pfeiltasten um durch die Ergebnisse zu scrollen.",
    );
  });

  it("should correctly set ids on all list items", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const searchbox = getSearchBox();
    await act(() => user.type(searchbox, "test"));
    const listbox = await screen.findByRole("listbox");

    // are options due to role=option
    const items = within(listbox).getAllByRole("option");
    expect(items).toHaveLength(3);
    expect(items[0].getAttribute("id")).toBe("autocomplete-suggestion-0");
    expect(items[1].getAttribute("id")).toBe("autocomplete-suggestion-1");
    expect(items[2].getAttribute("id")).toBe("autocomplete-suggestion-2");
  });

  it("should handle keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const searchbox = getSearchBox();
    await act(() => user.type(searchbox, "test"));
    await screen.findByRole("listbox");

    const getActiveDescendant = () =>
      searchbox.getAttribute("aria-activedescendant");

    expect(document.activeElement).toBe(searchbox);
    expect(getActiveDescendant()).toBeNull();

    // searchbox keeps focus, but active descendant changes
    await act(() => user.keyboard("{ArrowDown}"));
    expect(document.activeElement).toBe(searchbox);
    expect(getActiveDescendant()).toBe("autocomplete-suggestion-0");

    await act(() => user.keyboard("{ArrowDown}"));
    expect(getActiveDescendant()).toBe("autocomplete-suggestion-1");

    await act(() => user.keyboard("{ArrowDown}"));
    expect(getActiveDescendant()).toBe("autocomplete-suggestion-2");

    await act(() => user.keyboard("{ArrowDown}"));
    expect(getActiveDescendant()).toBe("autocomplete-suggestion-0");

    await act(() => user.keyboard("{ArrowUp}"));
    expect(getActiveDescendant()).toBe("autocomplete-suggestion-2");
  });

  it("should select an item on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<TestComponent />);

    const searchbox = getSearchBox();
    await act(() => user.type(searchbox, "test"));
    await screen.findByRole("listbox");

    const optionWie = screen.getByRole("option", { name: /wie/i });
    await act(() => user.click(optionWie));

    // wait until container closes
    await waitFor(() => {
      const sugContainer = getSuggestionsContainer(container);
      expect(sugContainer.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("should close on Escape", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const searchbox = getSearchBox();
    await act(() => user.type(searchbox, "test"));

    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeDefined();

    await act(() => user.keyboard("{Escape}"));

    const listBoxAfterEscape = screen.queryByRole("listbox");
    expect(listBoxAfterEscape).toBeNull();
  });
});
