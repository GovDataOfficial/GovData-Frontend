import { i18n } from "@/i18n";

type ShowcaseFormStickyNavigationItem = {
  stepName: string;
  stepContainerId: string;
  isActive: boolean;
};

export function ShowcaseFormStickyNavigationItem({
  stepName,
  stepContainerId,
  isActive,
}: ShowcaseFormStickyNavigationItem) {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const targetId = (event.currentTarget.getAttribute("href") || "").substring(
      1,
    ); // Get rid of #
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <li className={isActive ? "active" : ""} key={stepName}>
      <a
        aria-controls={stepContainerId}
        className="sticky-nav-button"
        href={`#${stepContainerId}`}
        onClick={handleClick}
      >
        <span className="sticky-nav-button-text-container">
          <span className="sticky-nav-button-text-container-stepName">
            {stepName}
          </span>

          {isActive && (
            <span className="sr-only">
              {i18n.t("showcaseform.stepInfo.active")}
            </span>
          )}
        </span>
      </a>
    </li>
  );
}
