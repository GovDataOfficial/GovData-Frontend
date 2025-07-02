import { PropsWithChildren } from "react";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { ShowcaseFormStepName } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { i18n } from "@/i18n";

export type ShowcaseFormStepContainer = {
  name: ShowcaseFormStepName;
};

export const generateStepContainerId = (name: string) =>
  `showcase-form-step-container-${name}`;

export function ShowcaseFormStepContainer({
  name,
  children,
}: PropsWithChildren<ShowcaseFormStepContainer>) {
  return (
    <section id={generateStepContainerId(name)} className="step-container">
      <h2>{i18n.t(`showcaseform.step.${name}`)}</h2>
      <DesignBox>{children}</DesignBox>
    </section>
  );
}
