import { i18n } from "@/i18n";
import { DropdownSelect } from "@/app/_components/Dropdown/DropdownSelect";
import {
  Direction,
  SortConfig,
  SortableData,
} from "@/app/_lib/hooks/useSortableData";
import { MetaDataOption } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";

export type MetaDataOverviewMobileSort = {
  options: MetaDataOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};

export function MetaDataOverviewMobileSort({
  sortByKeyAndDirection,
  options,
  sortConfig,
}: MetaDataOverviewMobileSort) {
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
