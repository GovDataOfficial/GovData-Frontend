import React, { PropsWithChildren } from "react";
import { Container } from "@/app/_components/Container/partials/Container";
import { ContainerContent } from "@/app/_components/Container/partials/ContainerContent";
import {
  ContainerWrapper,
  ContainerWrapperModifier,
} from "@/app/_components/Container/partials/ContainerWrapper";

export type ContainerSection = {
  headline?: string;
  headlineLevel?: "h1" | "h2" | "h3";
  description?: string;
  centerHeadline?: boolean;
  headlineInvisible?: boolean;
  modifier?: ContainerWrapperModifier[];
} & Container;

export function ContainerSection({
  headline,
  headlineLevel = "h1",
  centerHeadline,
  headlineInvisible,
  description,
  containerWidth,
  modifier,
  children,
}: PropsWithChildren<ContainerSection>) {
  const HeadlineLevel = headlineLevel;
  const headlineClasses = ["m-0", "mb-2"];

  centerHeadline && headlineClasses.push("text-center");
  headlineInvisible && headlineClasses.push("sr-only");

  return (
    <ContainerWrapper type="section" modifier={modifier}>
      <Container containerWidth={containerWidth}>
        <div className="row">
          <div className="col-12">
            {headline && (
              <HeadlineLevel className={headlineClasses.join(" ")}>
                {headline}
              </HeadlineLevel>
            )}
            {description && <p className="mt-0">{description}</p>}
          </div>
        </div>
        <ContainerContent>{children}</ContainerContent>
      </Container>
    </ContainerWrapper>
  );
}
