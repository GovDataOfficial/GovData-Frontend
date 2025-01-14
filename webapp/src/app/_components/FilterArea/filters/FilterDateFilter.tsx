"use client";

import { useSearchParams } from "next/navigation";

import { Accordion } from "@/app/_components/Accordion/Accordion";
import { Button } from "@/app/_components/Button/Button";
import { FilterCommonConsumer } from "@/app/_components/FilterArea/filters/FilterCommon";
import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";

export function FilterDateFilter({ filterMap }: FilterCommonConsumer) {
  const searchParams = useSearchParams();

  const {
    getActiveFiltersForHiddenInput,
    getStartDateFromCurrentSearchParams,
    getEndDateFromCurrentSearchParams,
  } = URLHelper(searchParams);

  const hiddenInputs = getActiveFiltersForHiddenInput(
    SPECIAL_FILTERS.END,
    SPECIAL_FILTERS.START,
  ).map((input) => <input {...input} key={input.key} />);

  const hasStartValue = isNotNullOrUndefined(filterMap.start);
  const hasEndValue = isNotNullOrUndefined(filterMap.end);

  const startValue = hasStartValue
    ? getStartDateFromCurrentSearchParams()
    : undefined;
  const endValue = hasEndValue
    ? getEndDateFromCurrentSearchParams()
    : undefined;

  return (
    <Accordion title={<h3>Zeitbezug</h3>} open>
      <form
        encType="application/x-www-form-urlencoded"
        method="get"
        action="/suche"
      >
        {hiddenInputs}
        <div className="gd-input gd-filterarea-date-container mt-2">
          <div className="gd-filterarea-date">
            <label className="d-block bold mb-0_5" htmlFor="filter-date-from">
              {i18n.t("search.filter.date.from.label")}
            </label>
            <input
              name="start"
              id="filter-date-from"
              type="date"
              defaultValue={startValue}
              title={i18n.t("search.filter.date.from.title")}
            />
          </div>
          <div className="gd-filterarea-date">
            <label className="d-block bold mb-0_5 " htmlFor="filter-date-until">
              {i18n.t("search.filter.date.to.label")}
            </label>
            <input
              name="end"
              id="filter-date-until"
              type="date"
              defaultValue={endValue}
              title={i18n.t("search.filter.date.to.title")}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Button variant="a" type="submit">
            {i18n.t("search.filter.date.submit.label")}
          </Button>
        </div>
      </form>
    </Accordion>
  );
}
