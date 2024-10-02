import { PropsWithChildren } from "react";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

export type MetaDataFormStepContainer = {
  currentStep: number;
  forStep: number;
  headline: string;
};

export const generateStepContainerId = (step: number) =>
  `metadata-form-step-container-${step}`;

export function MetaDataFormStepContainer({
  currentStep,
  forStep,
  headline,
  children,
}: PropsWithChildren<MetaDataFormStepContainer>) {
  const hidden = currentStep !== forStep && currentStep !== 7;
  const HeadLine = currentStep === 7 ? "h3" : "h2";

  const classList = ["step-container", "step-container-" + forStep];

  return (
    <div
      id={generateStepContainerId(forStep)}
      className={classList.join(" ")}
      aria-hidden={hidden}
    >
      <HeadLine>{headline}</HeadLine>
      <DesignBox>{children}</DesignBox>
    </div>
  );
}
