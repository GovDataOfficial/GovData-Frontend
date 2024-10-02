import React, { PropsWithChildren } from "react";
import { Container } from "@/app/_components/Container/partials/Container";
import { ContainerContent } from "@/app/_components/Container/partials/ContainerContent";
import {
  ContainerWrapper,
  ContainerWrapperModifier,
} from "@/app/_components/Container/partials/ContainerWrapper";

export type ContainerDiv = {
  modifier?: ContainerWrapperModifier[];
} & Container;

export function ContainerDiv({
  children,
  modifier,
  containerWidth,
  noGutter,
}: PropsWithChildren<ContainerDiv>) {
  return (
    <ContainerWrapper type="div" modifier={modifier}>
      <Container containerWidth={containerWidth} noGutter={noGutter}>
        <ContainerContent>{children}</ContainerContent>
      </Container>
    </ContainerWrapper>
  );
}
