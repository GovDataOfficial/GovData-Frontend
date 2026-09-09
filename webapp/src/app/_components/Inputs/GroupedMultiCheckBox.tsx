"use client";

import { useId } from "react";

import { Accordion } from "@/app/_components/Accordion/Accordion";
import { Label } from "@/app/_components/Inputs/partials/Label";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";
import { useCheckboxGroup } from "@/app/_components/Inputs/useCheckboxGroup";
import { groupHvdByTopLevel } from "@/app/_lib/hvdCategories";
import { i18n } from "@/i18n";
import { HvdCategoryMap } from "@/types/types";

type GroupedMultiCheckBoxProps = {
  /**
   * Backend HVD vocabulary. Rendered as an accordion per top-level category plus a
   * flat checkbox list underneath each group.
   */
  hvdMap: HvdCategoryMap;
  /**
   * URIs already tagged on the edited dataset — used to pre-check the corresponding
   * checkbox and to auto-open its enclosing accordion group so editors see current
   * selections without expanding manually.
   */
  defaultChecked?: string[];
  legend: string;
  name: string;
  required?: boolean;
  recommended?: boolean;
};

/**
 * Multi-select checkbox widget for the HVD category field in the metadata editing form.
 * Groups the ~90+ vocabulary entries by their EU top-level theme inside collapsible
 * accordions so editors are not confronted with a wall of 90 checkboxes.
 * <p>
 * Structurally parallel to {@link GroupedFilterMultiBox} in the extended search but
 * different in one important dimension: this widget participates in a native HTML form
 * (values submitted via {@code name}), while the search variant reads/writes URL query
 * params. Both share the same {@link groupHvdByTopLevel} grouping helper.
 * <p>
 * When {@code hvdMap} has no sub-categories (backend outage → legacy fallback of 6
 * top-level entries), the accordion structure would degrade to 6 single-item groups.
 * We detect that case and render a flat checkbox list instead — same behaviour as
 * {@code GroupedFilterMultiBox}.
 */
export function GroupedMultiCheckBox({
  hvdMap,
  defaultChecked = [],
  legend,
  name,
  required,
  recommended,
}: GroupedMultiCheckBoxProps) {
  const id = useId();
  const errorMessage = i18n.t("form.checkboxgroup.atLeastOne.error");
  const checkedSet = new Set(defaultChecked);

  const groups = groupHvdByTopLevel(hvdMap);
  const hasAnyDescendants = groups.some((g) => g.descendants.length > 0);

  // URIs already on the dataset but missing from the current vocabulary render no
  // checkbox — without preserving them, save would silently drop them because the
  // POST replaces the whole list. Emit hidden inputs so they round-trip untouched.
  // Triggers when the vocabulary sync is degraded (e.g. fallback vocabulary in effect).
  // Dedupe via checkedSet: dataset payloads may repeat the same URI, and duplicates
  // would otherwise blow up React keys and inflate initialSelectedCount.
  const preservedUris = [...checkedSet].filter((uri) => !hvdMap[uri]);

  const initialSelectedCount = checkedSet.size;

  const { setElementRef, onCheckboxChange } = useCheckboxGroup(
    errorMessage,
    required ? 1 : 0,
    initialSelectedCount,
  );

  const renderCheckbox = (uri: string, label: string) => {
    const itemId = `${id}_${uri}`;
    return (
      <li key={uri} className="gd-input-multi-checkbox-item">
        <input
          id={itemId}
          value={uri}
          name={name}
          defaultChecked={checkedSet.has(uri)}
          type="checkbox"
          ref={setElementRef}
          onChange={onCheckboxChange}
        />
        <Label label={label} htmlFor={itemId} />
      </li>
    );
  };

  return (
    <div className="gd-input">
      <fieldset>
        <legend>
          {legend}
          {required && <strong aria-hidden="true">&nbsp;*</strong>}
          {recommended && <RecommendedInfo />}
        </legend>

        {hasAnyDescendants ? (
          groups.map((group) => {
            const items = [group.topLevel, ...group.descendants];
            const activeCount = items.filter((item) =>
              checkedSet.has(item.uri),
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
                        {i18n.t(
                          "filter.hvd_categories.extended.group.selected",
                          { count: activeCount },
                        )}
                        )
                      </span>
                    )}
                  </span>
                }
              >
                <ul className="gd-list col-2">
                  {items.map((item) =>
                    renderCheckbox(item.uri, item.labelDe ?? item.uri),
                  )}
                </ul>
              </Accordion>
            );
          })
        ) : (
          <ul className="gd-list col-2">
            {groups.map((g) =>
              renderCheckbox(
                g.topLevel.uri,
                g.topLevel.labelDe ?? g.topLevel.uri,
              ),
            )}
          </ul>
        )}
        {preservedUris.map((uri) => (
          <input key={uri} type="hidden" name={name} value={uri} />
        ))}
      </fieldset>
    </div>
  );
}
