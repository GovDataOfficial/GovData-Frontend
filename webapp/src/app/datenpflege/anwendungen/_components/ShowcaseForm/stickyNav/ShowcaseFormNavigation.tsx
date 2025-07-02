import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { generateStepContainerId } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormStepContainer";
import { ShowcaseFormStickyNavigationItem } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/ShowcaseFormNavigationItem";
import { useShowcaseFormStickyNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation";
import { i18n } from "@/i18n";

export function ShowcaseFormNavigation() {
  const { t } = i18n;

  const items = ["contents", "links", "contact"];

  const { isActive } = useShowcaseFormStickyNavigation();

  return (
    <nav
      className="sticky-form-navigation d-none d-md-block"
      aria-label={i18n.t("showcaseform.navigation.sticky.label")}
    >
      <h2 className="sr-only">
        {i18n.t("showcaseform.navigation.sticky.label")}
      </h2>
      <DesignBox noPadding>
        <ul>
          {items.map((item) => {
            const stepContainerId = generateStepContainerId(item);
            return (
              <ShowcaseFormStickyNavigationItem
                key={item}
                stepName={t(`showcaseform.step.${item}`)}
                stepContainerId={stepContainerId}
                isActive={isActive(stepContainerId)}
              />
            );
          })}
        </ul>
      </DesignBox>
    </nav>
  );
}
