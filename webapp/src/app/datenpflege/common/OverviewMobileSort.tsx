import { DropdownSelect } from "@/app/_components/Dropdown/DropdownSelect";
import {
  Direction,
  SortableData,
  SortableDataOption,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { i18n } from "@/i18n";

export type SortOption = SortableDataOption<SortableData> & {
  labelKey: string;
};

export type OverviewMobileSort = {
  options: SortOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};

export function OverviewMobileSort({
  sortByKeyAndDirection,
  options,
  sortConfig,
}: OverviewMobileSort) {
  const { t } = i18n;

  const selectOptions: string[] = [];

  options.forEach((option) => {
    selectOptions.push(`${option.key}_asc`);
    selectOptions.push(`${option.key}_desc`);
  });

  const sortOption = (option: string) => {
    const keyAndDirection = option.split("_");
    const direction = keyAndDirection[1] === "asc" ? "ascending" : "descending";
    sortByKeyAndDirection(keyAndDirection[0], direction);
  };

  const getDropdownTitle = () => {
    if (!sortConfig) {
      return t("overview.sortby.title");
    }
    return t(
      `overview.sortby.${sortConfig.key}_${sortConfig.direction === "ascending" ? "asc" : "desc"}`,
    );
  };

  return (
    <>
      <DropdownSelect
        options={selectOptions}
        title={getDropdownTitle()}
        label={t("overview.sortby.title")}
      >
        {(option, closeMenu) => (
          <button
            className="text-left"
            onClick={() => {
              sortOption(option);
              closeMenu();
            }}
          >
            {t("overview.sortby." + option)}
          </button>
        )}
      </DropdownSelect>
    </>
  );
}
