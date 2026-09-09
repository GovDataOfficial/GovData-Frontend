"use client";

import { useSearchParams } from "next/navigation";

import { Accordion } from "@/app/_components/Accordion/Accordion";
import { groupHvdByTopLevel } from "@/app/_lib/hvdCategories";
import { i18n } from "@/i18n";
import { HvdCategory, HvdCategoryMap } from "@/types/types";

type GroupedFilterMultiBoxProps = {
  /**
   * URL query-parameter name and form field name (e.g. "hvd_categories").
   */
  type: string;
  /**
   * Backend HVD vocabulary. When empty or containing only top-level entries (no
   * {@code parentUri} anywhere), the widget degrades to a flat checkbox list so we do
   * not present six accordions of one item each — that is more noise than help.
   */
  map: HvdCategoryMap;
};

/**
 * Accordion-grouped multi-select checkbox widget for the HVD category filter. Groups
 * are the six top-level EU HVD themes; each group's descendants are folded underneath
 * the accordion header.
 *
 * Accessibility rests on native {@code <details>}/{@code <summary>} (via the shared
 * {@link Accordion} component): browsers expose the expand/collapse state via correct
 * ARIA semantics automatically, keyboard toggling (Enter/Space) works out of the box,
 * and screen readers announce the group state. Each group additionally wraps its
 * checkboxes in a {@code <fieldset>}/{@code <legend>} to make the grouping
 * programmatically determinable (WCAG 1.3.1).
 *
 * When any checkbox in a group is active (URL param matches), the accordion opens by
 * default so the user always sees active selections even after navigating back.
 */
export function GroupedFilterMultiBox({
  type,
  map,
}: GroupedFilterMultiBoxProps) {
  const searchParams = useSearchParams();
  const activeParams = searchParams.getAll(type);

  const groups = groupHvdByTopLevel(map);

  // When no sub-categories exist (e.g. backend down → fallback to legacy top-level
  // only) the accordion structure would collapse to six single-item groups. Skip it
  // and render a plain flat list instead.
  const hasAnyDescendants = groups.some((g) => g.descendants.length > 0);
  if (!hasAnyDescendants) {
    return (
      <FlatCheckboxList
        type={type}
        entries={groups.map((g) => g.topLevel)}
        activeParams={activeParams}
      />
    );
  }

  return (
    <div className="multiboxarea">
      {groups.map((group) => {
        const items = [group.topLevel, ...group.descendants];
        const activeCount = items.filter((item) =>
          activeParams.includes(item.uri),
        ).length;
        const groupLabel = group.topLevel.labelDe ?? group.topLevel.uri;
        return (
          <Accordion
            key={group.topLevel.uri}
            open={activeCount > 0}
            title={
              <span className="gd-filter-group-title">
                {groupLabel}
                {activeCount > 0 && (
                  <span className="gd-filter-group-count ms-1">
                    (
                    {i18n.t("filter.hvd_categories.extended.group.selected", {
                      count: activeCount,
                    })}
                    )
                  </span>
                )}
              </span>
            }
          >
            <fieldset className="multiboxarea">
              <legend className="offscreen">{groupLabel}</legend>
              {items.map((item) => (
                <CategoryCheckbox
                  key={item.uri}
                  type={type}
                  category={item}
                  checked={activeParams.includes(item.uri)}
                />
              ))}
            </fieldset>
          </Accordion>
        );
      })}
    </div>
  );
}

type FlatCheckboxListProps = {
  type: string;
  entries: HvdCategory[];
  activeParams: string[];
};

function FlatCheckboxList({
  type,
  entries,
  activeParams,
}: FlatCheckboxListProps) {
  const text = i18n.t("filter." + type + ".extended.title");
  return (
    <fieldset className="multiboxarea">
      <legend className="offscreen">{"in " + text}</legend>
      {entries.map((item) => (
        <CategoryCheckbox
          key={item.uri}
          type={type}
          category={item}
          checked={activeParams.includes(item.uri)}
        />
      ))}
    </fieldset>
  );
}

type CategoryCheckboxProps = {
  type: string;
  category: HvdCategory;
  checked: boolean;
};

function CategoryCheckbox({ type, category, checked }: CategoryCheckboxProps) {
  const id = `${type}_${category.uri}`;
  const label = category.labelDe ?? category.uri;
  return (
    <div className="checkboxitem">
      <input
        className="offscreen"
        id={id}
        value={category.uri}
        name={type}
        type="checkbox"
        defaultChecked={checked}
      />
      <label className="checkbox" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
