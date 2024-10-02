import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";

export function FilterTemporalCoverage() {
  const fromId = "filter-date-from";
  const untilId = "filter-date-until";

  const searchParams = useSearchParams();
  const startParam = searchParams.get("start") || undefined;
  const endParam = searchParams.get("end") || undefined;

  return (
    <div>
      <fieldset>
        <div className="flex-container">
          <legend className="offscreen">
            {i18n.t("filter.temporal_coverage.legend")}
          </legend>
          <div className="date-from-container date-container">
            <label htmlFor={fromId} className="date-label">
              {i18n.t("filter.temporal_coverage.from")}:
            </label>
            <input
              type="date"
              name="start"
              id={fromId}
              className="filter-date-from"
              defaultValue={startParam}
            />
          </div>
          <div className="date-until-container date-container">
            <label htmlFor={untilId} className="date-label">
              {i18n.t("filter.temporal_coverage.until")}:
            </label>
            <input
              type="date"
              name="end"
              id={untilId}
              className="filter-date-until"
              defaultValue={endParam}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
