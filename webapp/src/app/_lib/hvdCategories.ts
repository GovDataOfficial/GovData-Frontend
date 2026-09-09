import { HvdCategory, HvdCategoryMap } from "@/types/types";

/**
 * Static fallback vocabulary containing the six legacy top-level HVD categories.
 * Used when the backend sync endpoint is unreachable so that the extended search
 * still offers a usable — if incomplete — filter list instead of an empty widget.
 *
 * URIs match the canonical EU vocabulary (http://data.europa.eu/bna/); German labels
 * mirror the retired i18n keys `category.label.<met|cco|geo|eoe|mob|sta>`.
 */
export const FALLBACK_HVD_CATEGORY_MAP: HvdCategoryMap = {
  "http://data.europa.eu/bna/c_164e0bf5": {
    uri: "http://data.europa.eu/bna/c_164e0bf5",
    labelDe: "Meteorologie",
    labelEn: "Meteorological",
    parentUri: null,
    deprecated: false,
  },
  "http://data.europa.eu/bna/c_a9135398": {
    uri: "http://data.europa.eu/bna/c_a9135398",
    labelDe: "Unternehmen und Eigentümerschaft von Unternehmen",
    labelEn: "Companies and company ownership",
    parentUri: null,
    deprecated: false,
  },
  "http://data.europa.eu/bna/c_ac64a52d": {
    uri: "http://data.europa.eu/bna/c_ac64a52d",
    labelDe: "Georaum",
    labelEn: "Geospatial",
    parentUri: null,
    deprecated: false,
  },
  "http://data.europa.eu/bna/c_dd313021": {
    uri: "http://data.europa.eu/bna/c_dd313021",
    labelDe: "Erdbeobachtung und Umwelt",
    labelEn: "Earth observation and environment",
    parentUri: null,
    deprecated: false,
  },
  "http://data.europa.eu/bna/c_b79e35eb": {
    uri: "http://data.europa.eu/bna/c_b79e35eb",
    labelDe: "Mobilität",
    labelEn: "Mobility",
    parentUri: null,
    deprecated: false,
  },
  "http://data.europa.eu/bna/c_e1da4e07": {
    uri: "http://data.europa.eu/bna/c_e1da4e07",
    labelDe: "Statistik",
    labelEn: "Statistics",
    parentUri: null,
    deprecated: false,
  },
};

/**
 * Resolves an HVD category URI to a human-readable German label. Falls back to the URI
 * itself when the URI is not known to the backend vocabulary — this happens when a new
 * EU sub-category appears before the next sync, or when a caller passes an obsolete
 * URI. Matches the ticket acceptance criterion "unbekannte HVD-Kategorien … es wird
 * stets die URI anstelle des Namen angezeigt".
 *
 * @param uri full HVD category URI (e.g. "http://data.europa.eu/bna/c_ac64a52d")
 * @param map the vocabulary map, typically obtained from `fetchHvdCategoryMap()`
 * @returns the German label if known, otherwise the URI itself
 */
export function labelForHvdUri(uri: string, map: HvdCategoryMap): string {
  return map[uri]?.labelDe ?? uri;
}

/**
 * Convenience lookup returning the full {@link HvdCategory} entry or {@code undefined}
 * if the URI is unknown. Prefer {@link labelForHvdUri} when only the display label is
 * needed.
 */
export function findHvdCategory(
  uri: string,
  map: HvdCategoryMap,
): HvdCategory | undefined {
  return map[uri];
}

/**
 * Reduces the given vocabulary map to entries that are considered "available" —
 * typically because the search backend reported them as a facet value on at least one
 * indexed dataset. Ancestors of any available entry are retained even if the ancestor
 * itself is not directly available, so the grouping structure (top-level → sub) stays
 * intact and users still see the enclosing group heading in the UI.
 *
 * URIs unknown to the vocabulary are ignored. Key order of the result follows discovery
 * order, not the order of {@code map} — callers must not rely on it ({@link
 * groupHvdByTopLevel} sorts by label anyway).
 *
 * @param map full vocabulary from the backend
 * @param availableUris URIs that should be considered available (e.g. facet keys)
 * @returns a new map containing only available entries plus their ancestors
 */
export function filterHvdMapToAvailable(
  map: HvdCategoryMap,
  availableUris: Iterable<string>,
): HvdCategoryMap {
  const kept: HvdCategoryMap = {};
  for (const uri of availableUris) {
    keepWithAncestors(uri, map, kept);
  }
  return kept;
}

/**
 * Adds the vocabulary entry for {@code uri} plus its whole ancestor chain to
 * {@code kept}. URIs unknown to the vocabulary are ignored, as are chains that leave the
 * vocabulary partway.
 */
function keepWithAncestors(
  uri: string,
  map: HvdCategoryMap,
  kept: HvdCategoryMap,
): void {
  let current = findHvdCategory(uri, map);
  while (keep(current, kept)) {
    kept[current.uri] = current;
    current = current.parentUri
      ? findHvdCategory(current.parentUri, map)
      : undefined;
  }
}

/**
 * Whether {@code category} still has to be added to {@code kept}. Yields {@code false}
 * for an entry that is already there, and for the {@code undefined} of a URI outside the
 * vocabulary.
 */
function keep(
  category: HvdCategory | undefined,
  kept: HvdCategoryMap,
): category is HvdCategory {
  return category !== undefined && !(category.uri in kept);
}

/**
 * Groups the flat HVD vocabulary into top-level buckets with all transitive descendants
 * folded underneath each top-level. Follows {@code parentUri} upwards until it hits a
 * root (an entry without a parent, or a parent not present in the map). Cycles are
 * guarded against defensively.
 *
 * Result groups and their descendants are sorted alphabetically by German label so the
 * UI order is stable and locale-friendly. Orphan concepts (whose parent chain never
 * reaches a known top-level) are placed under a synthetic "Weitere" bucket at the end.
 */
export function groupHvdByTopLevel(map: HvdCategoryMap): {
  topLevel: HvdCategory;
  descendants: HvdCategory[];
}[] {
  const buckets = new Map<
    string,
    { topLevel: HvdCategory; descendants: HvdCategory[] }
  >();

  for (const category of Object.values(map)) {
    if (!category.parentUri) {
      if (!buckets.has(category.uri)) {
        buckets.set(category.uri, { topLevel: category, descendants: [] });
      }
    }
  }

  const orphans: HvdCategory[] = [];

  for (const category of Object.values(map)) {
    if (!category.parentUri) {
      continue;
    }
    const root = walkToRoot(category, map);
    if (root && buckets.has(root.uri)) {
      buckets.get(root.uri)!.descendants.push(category);
    } else {
      orphans.push(category);
    }
  }

  const compareByLabel = (a: HvdCategory, b: HvdCategory) =>
    (a.labelDe ?? a.uri).localeCompare(b.labelDe ?? b.uri, "de");

  const groups = Array.from(buckets.values());
  for (const g of groups) {
    g.descendants.sort(compareByLabel);
  }
  groups.sort((a, b) => compareByLabel(a.topLevel, b.topLevel));

  if (orphans.length > 0) {
    orphans.sort(compareByLabel);
    groups.push({
      topLevel: {
        uri: "urn:hvd-category-fallback:other",
        labelDe: "Weitere",
        labelEn: "Other",
        parentUri: null,
        deprecated: false,
      },
      descendants: orphans,
    });
  }

  return groups;
}

/**
 * Walks the {@code parentUri} chain of {@code start} until it finds a category with no
 * parent, or a parent URI that is not present in the map. Returns {@code null} if the
 * chain is broken partway (parent URI referenced but not in the map). Cycle-safe.
 */
function walkToRoot(
  start: HvdCategory,
  map: HvdCategoryMap,
): HvdCategory | null {
  let current: HvdCategory = start;
  const visited = new Set<string>();
  while (current.parentUri) {
    if (visited.has(current.uri)) {
      return null;
    }
    visited.add(current.uri);
    const parent = map[current.parentUri];
    if (!parent) {
      return null;
    }
    current = parent;
  }
  return current;
}
