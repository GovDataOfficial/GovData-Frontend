import { describe, expect, it, vi } from "vitest";
import {
  BaseMapSuggestResponse,
  LocationSearch,
  OSMSuggestResponse,
} from "@/app/kartensuche/_components/LocationSearch";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("LocationSearch", () => {
  const mockOSMSuggestResponse = [
    {
      osm_type: "node",
      osm_id: 9295643525,
      display_name: "Philippinen",
      boundingbox: ["11.3742595", "11.4142595", "122.5292143", "122.5692143"],
    },
    {
      osm_type: "node",
      osm_id: 3367652278,
      display_name: "TestLocation",
      boundingbox: ["11.4209794", "11.4609794", "122.0420189", "122.0820189"],
    },
  ] satisfies OSMSuggestResponse;

  const mockBaseMapSuggestResponse = {
    features: [
      { properties: { typ: "ort", text: "Ort Nummer 1" }, bbox: [], id: "1" },
      { properties: { typ: "straße", text: "Straße 55" }, bbox: [], id: "2" },
    ],
    type: "FeatureCollection",
  } satisfies BaseMapSuggestResponse;

  it("should correctly map osm response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockOSMSuggestResponse),
    });

    const user = userEvent.setup();

    render(<LocationSearch />);

    const box = screen.getByRole("searchbox", { name: /nach orten suchen/i });
    await user.type(box, "555");
    const listbox = await screen.findByRole("listbox");

    within(listbox).getByRole("option", { name: /philippinen/i });
    within(listbox).getByRole("option", { name: /testlocation/i });
  });

  it("should correctly map basemap response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockBaseMapSuggestResponse),
    });

    const user = userEvent.setup();

    render(<LocationSearch />);

    const box = screen.getByRole("searchbox", { name: /nach orten suchen/i });
    await user.type(box, "test");
    const listbox = await screen.findByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options[0].textContent).toBe("Ort Nummer 1 ort");
    expect(options[1].textContent).toBe("Straße 55 straße");
  });
});
