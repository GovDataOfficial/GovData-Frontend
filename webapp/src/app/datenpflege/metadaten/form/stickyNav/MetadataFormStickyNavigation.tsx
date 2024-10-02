import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { Dispatch, SetStateAction } from "react";
import { i18n } from "@/i18n";
import { MetaDataFormStickyNavigationItem } from "@/app/datenpflege/metadaten/form/stickyNav/partials/MetaDataFormStickyNavigationItem";

type MetadataFormStickyNavigation = {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
  checkValidityOfStep: (step: number) => boolean;
  mobile?: boolean;
};

export function MetadataFormStickyNavigation({
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
  mobile,
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

  const NavigationList = (
    <ul>
      {items.map((item, index) => (
        <MetaDataFormStickyNavigationItem
          key={item}
          index={index}
          stepName={item}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          checkValidityOfStep={checkValidityOfStep}
        />
      ))}
    </ul>
  );

  if (mobile) {
    return (
      <nav
        className="metadata-sticky-form-navigation mobile"
        aria-label={i18n.t("metadataform.navigation.sticky.label")}
      >
        {NavigationList}
        {/*<MetaDataFormStickyNavMobileErrors currentStep={currentStep} />*/}
      </nav>
    );
  }

  return (
    <nav
      className="metadata-sticky-form-navigation"
      aria-label={i18n.t("metadataform.navigation.sticky.label")}
    >
      <DesignBox noPadding>{NavigationList}</DesignBox>
    </nav>
  );
}
