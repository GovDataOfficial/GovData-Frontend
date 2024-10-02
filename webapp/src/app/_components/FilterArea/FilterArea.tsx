import { i18n } from "@/i18n";
import { PropsWithChildren } from "react";
import { FilterAreaResetButton } from "@/app/_components/FilterArea/FilterAreaResetButton";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

type FilterArea = {
  showResetBottomButton?: boolean;
};

export function FilterArea({
  children,
  showResetBottomButton = true,
}: PropsWithChildren<FilterArea>) {
  return (
    <DesignBox extraClasses={["gd-filterarea"]}>
      <div className="gd-filterarea-head">
        <h2 className="gd-filterarea-title">
          {i18n.t("search.results.filter.title")}
        </h2>
        <FilterAreaResetButton />
      </div>
      {children}
      {showResetBottomButton && (
        <div className="reset-button mt-4 d-flex justify-content-end">
          <FilterAreaResetButton />
        </div>
      )}
    </DesignBox>
  );
}
