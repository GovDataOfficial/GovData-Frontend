import { describe, expect, it } from "vitest";

import {
  FALLBACK_HVD_CATEGORY_MAP,
  filterHvdMapToAvailable,
  findHvdCategory,
  groupHvdByTopLevel,
  labelForHvdUri,
} from "@/app/_lib/hvdCategories";
import { HvdCategoryMap } from "@/types/types";

const GEO_URI = "http://data.europa.eu/bna/c_ac64a52d";
const NO_LABEL_URI = "http://data.europa.eu/bna/c_no_label";

const MAP: HvdCategoryMap = {
  [GEO_URI]: {
    uri: GEO_URI,
    labelDe: "Georaum",
    labelEn: "Geospatial",
    parentUri: null,
    deprecated: false,
  },
  [NO_LABEL_URI]: {
    uri: NO_LABEL_URI,
    labelDe: null,
    labelEn: null,
    parentUri: null,
    deprecated: false,
  },
};

describe("labelForHvdUri", () => {
  it("returns the German label for a known URI", () => {
    expect(labelForHvdUri(GEO_URI, MAP)).toBe("Georaum");
  });

  it("falls back to the URI when the entry has no German label", () => {
    expect(labelForHvdUri(NO_LABEL_URI, MAP)).toBe(NO_LABEL_URI);
  });

  it("falls back to the URI when the URI is not in the map", () => {
    const unknown = "http://data.europa.eu/bna/c_future_subcategory";
    expect(labelForHvdUri(unknown, MAP)).toBe(unknown);
  });

  it("returns the URI when the map is empty", () => {
    expect(labelForHvdUri(GEO_URI, {})).toBe(GEO_URI);
  });
});

describe("findHvdCategory", () => {
  it("returns the entry for a known URI", () => {
    expect(findHvdCategory(GEO_URI, MAP)).toEqual(MAP[GEO_URI]);
  });

  it("returns undefined for an unknown URI", () => {
    expect(
      findHvdCategory("http://data.europa.eu/bna/c_missing", MAP),
    ).toBeUndefined();
  });
});

describe("FALLBACK_HVD_CATEGORY_MAP", () => {
  it("contains the six legacy top-level HVD categories", () => {
    expect(Object.keys(FALLBACK_HVD_CATEGORY_MAP)).toHaveLength(6);
    expect(
      FALLBACK_HVD_CATEGORY_MAP["http://data.europa.eu/bna/c_ac64a52d"],
    ).toMatchObject({ labelDe: "Georaum", parentUri: null });
  });
});

describe("groupHvdByTopLevel", () => {
  const met = "http://data.europa.eu/bna/c_164e0bf5";
  const geo = "http://data.europa.eu/bna/c_ac64a52d";
  const sub = "http://data.europa.eu/bna/c_sub_addresses";
  const orphan = "http://data.europa.eu/bna/c_orphan";

  const tree: HvdCategoryMap = {
    [met]: {
      uri: met,
      labelDe: "Meteorologie",
      labelEn: "Meteorological",
      parentUri: null,
      deprecated: false,
    },
    [geo]: {
      uri: geo,
      labelDe: "Georaum",
      labelEn: "Geospatial",
      parentUri: null,
      deprecated: false,
    },
    [sub]: {
      uri: sub,
      labelDe: "Adressen",
      labelEn: "Addresses",
      parentUri: geo,
      deprecated: false,
    },
    [orphan]: {
      uri: orphan,
      labelDe: "Waisenkonzept",
      labelEn: "Orphan concept",
      parentUri: "http://data.europa.eu/bna/c_missing_parent",
      deprecated: false,
    },
  };

  it("groups descendants under their top-level ancestor", () => {
    const groups = groupHvdByTopLevel(tree);
    const geoGroup = groups.find((g) => g.topLevel.uri === geo);
    expect(geoGroup?.descendants).toHaveLength(1);
    expect(geoGroup?.descendants[0].uri).toBe(sub);
  });

  it("sorts groups alphabetically by German label", () => {
    const groups = groupHvdByTopLevel(tree);
    const labels = groups.map((g) => g.topLevel.labelDe);
    // Georaum, Meteorologie, Weitere (orphan bucket)
    expect(labels).toEqual(["Georaum", "Meteorologie", "Weitere"]);
  });

  it("collects concepts whose parent chain does not reach a known top-level under a synthetic 'Weitere' group", () => {
    const groups = groupHvdByTopLevel(tree);
    const others = groups.find((g) => g.topLevel.labelDe === "Weitere");
    expect(others?.descendants).toHaveLength(1);
    expect(others?.descendants[0].uri).toBe(orphan);
  });

  it("returns each fallback top-level as its own empty group", () => {
    const groups = groupHvdByTopLevel(FALLBACK_HVD_CATEGORY_MAP);
    expect(groups).toHaveLength(6);
    expect(groups.every((g) => g.descendants.length === 0)).toBe(true);
  });

  it("returns an empty array for an empty map", () => {
    expect(groupHvdByTopLevel({})).toEqual([]);
  });

  it("does not infinite-loop on a parent-URI cycle and buckets the cycle members under 'Weitere'", () => {
    // A ↔ B: two categories that both name each other as parent. walkToRoot must
    // detect the visited node on the second hop and bail out with null so the
    // caller treats them as orphans instead of iterating forever.
    const a = "http://data.europa.eu/bna/c_cycle_a";
    const b = "http://data.europa.eu/bna/c_cycle_b";
    const groups = groupHvdByTopLevel({
      [a]: {
        uri: a,
        labelDe: "A",
        labelEn: "A",
        parentUri: b,
        deprecated: false,
      },
      [b]: {
        uri: b,
        labelDe: "B",
        labelEn: "B",
        parentUri: a,
        deprecated: false,
      },
    });

    const others = groups.find((g) => g.topLevel.labelDe === "Weitere");
    expect(others?.descendants.map((d) => d.uri).sort()).toEqual([a, b]);
  }, 1000);

  it("sorts entries with null labelDe by their URI (not by 'null')", () => {
    // "http://…" starts with lowercase 'h' — behind "Meteorologie" (M) alphabetically,
    // but before "Zeta". If the comparator dereferenced null.localeCompare it would throw;
    // if it coerced null to the string "null" it would sort under 'n'. Neither is what
    // we want — the URI-fallback keeps the entry in a deterministic position.
    const uriOnly = "http://data.europa.eu/bna/c_no_label";
    const zeta = "http://data.europa.eu/bna/c_zeta";
    const groups = groupHvdByTopLevel({
      [met]: {
        uri: met,
        labelDe: "Meteorologie",
        labelEn: "Meteorological",
        parentUri: null,
        deprecated: false,
      },
      [uriOnly]: {
        uri: uriOnly,
        labelDe: null,
        labelEn: null,
        parentUri: null,
        deprecated: false,
      },
      [zeta]: {
        uri: zeta,
        labelDe: "Zeta",
        labelEn: "Zeta",
        parentUri: null,
        deprecated: false,
      },
    });

    const orderedKeys = groups.map((g) => g.topLevel.labelDe ?? g.topLevel.uri);
    expect(orderedKeys).toEqual([uriOnly, "Meteorologie", "Zeta"]);
  });
});

describe("filterHvdMapToAvailable", () => {
  const geo = "http://data.europa.eu/bna/c_ac64a52d";
  const met = "http://data.europa.eu/bna/c_164e0bf5";
  const addresses = "http://data.europa.eu/bna/c_sub_addresses";
  const buildings = "http://data.europa.eu/bna/c_sub_buildings";

  const tree: HvdCategoryMap = {
    [geo]: {
      uri: geo,
      labelDe: "Georaum",
      labelEn: "Geospatial",
      parentUri: null,
      deprecated: false,
    },
    [met]: {
      uri: met,
      labelDe: "Meteorologie",
      labelEn: "Meteorological",
      parentUri: null,
      deprecated: false,
    },
    [addresses]: {
      uri: addresses,
      labelDe: "Adressen",
      labelEn: "Addresses",
      parentUri: geo,
      deprecated: false,
    },
    [buildings]: {
      uri: buildings,
      labelDe: "Gebäude",
      labelEn: "Buildings",
      parentUri: geo,
      deprecated: false,
    },
  };

  it("keeps directly available entries", () => {
    const result = filterHvdMapToAvailable(tree, [geo]);
    expect(Object.keys(result)).toContain(geo);
  });

  it("drops top-level entries whose neither self nor descendants are available", () => {
    const result = filterHvdMapToAvailable(tree, [addresses]);
    expect(Object.keys(result)).not.toContain(met);
  });

  it("keeps ancestors of available descendants so grouping stays intact", () => {
    const result = filterHvdMapToAvailable(tree, [addresses]);
    expect(Object.keys(result)).toContain(geo);
    expect(Object.keys(result)).toContain(addresses);
    expect(Object.keys(result)).not.toContain(buildings);
  });

  it("keeps both siblings under a shared parent without duplicating or losing entries", () => {
    // Two siblings under the same parent: the second call to keepWithAncestors
    // must stop at the already-kept parent (via keep()'s "uri in kept" check)
    // instead of overwriting or looping. This is the invariant that allows
    // filterHvdMapToAvailable to omit its own visited set.
    const result = filterHvdMapToAvailable(tree, [addresses, buildings]);
    expect(Object.keys(result).sort()).toEqual(
      [geo, addresses, buildings].sort(),
    );
  });

  it("returns an empty map when nothing is available", () => {
    expect(filterHvdMapToAvailable(tree, [])).toEqual({});
  });

  it("ignores unknown URIs in the availability list", () => {
    const result = filterHvdMapToAvailable(tree, [
      geo,
      "http://data.europa.eu/bna/c_never_seen",
    ]);
    expect(Object.keys(result)).toEqual([geo]);
  });
});
