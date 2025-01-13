import { Dispatch, SetStateAction } from "react";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { MetaDataFormStickyNavigationItem } from "@/app/datenpflege/_components/MetaDataForm/stickNav/partials/MetaDataFormStickyNavigationItem";
import { i18n } from "@/i18n";

type MetadataFormStickyNavigation = {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
  checkValidityOfStep: (step: number) => boolean;
  editMode?: boolean;
};

export function MetadataFormStickyNavigation({
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
  editMode,
}: MetadataFormStickyNavigation) {
  const { t } = i18n;

  const items = [
    t("metadataform.step.data"),
    t("metadataform.step.contents"),
    t("metadataform.step.contacts"),
    t("metadataform.step.geo"),
    t("metadataform.step.time"),
    t("metadataform.step.resources"),
    t("metadataform.step.additional"),
    t("metadataform.step.summary"),
  ];

  return (
    <nav
      className="metadata-sticky-form-navigation"
      aria-label={i18n.t("metadataform.navigation.sticky.label")}
    >
      <h2 className="sr-only">
        {i18n.t("metadataform.navigation.sticky.label")}
      </h2>
      <DesignBox noPadding>
        <ul>
          {items.map((item, index) => (
            <MetaDataFormStickyNavigationItem
              key={item}
              index={index}
              stepName={item}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              checkValidityOfStep={checkValidityOfStep}
              editMode={editMode}
            />
          ))}
        </ul>
      </DesignBox>
    </nav>
  );
}
