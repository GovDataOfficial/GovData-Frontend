import { DropdownSelect } from "@/app/_components/Dropdown/DropdownSelect";
import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { MetadataOption } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewTypes";
import { i18n } from "@/i18n";

export type MetadataOverviewMobileSort = {
  options: MetadataOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};

export function MetadataOverviewMobileSort({
  sortByKeyAndDirection,
  options,
  sortConfig,
}: MetadataOverviewMobileSort) {
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
      return t("metadataoverview.sortby.title");
    }
    return t(
      `metadataoverview.sortby.${sortConfig.key}_${sortConfig.direction === "ascending" ? "asc" : "desc"}`,
    );
  };

  return (
    <>
      <DropdownSelect
        options={selectOptions}
        title={getDropdownTitle()}
        label={t("metadataoverview.sortby.title")}
      >
        {(option, closeMenu) => (
          <button
            className="text-left"
            onClick={() => {
              sortOption(option);
              closeMenu();
            }}
          >
            {t("metadataoverview.sortby." + option)}
          </button>
        )}
      </DropdownSelect>
    </>
  );
}
