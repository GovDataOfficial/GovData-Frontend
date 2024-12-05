"use client";

import { ContainerSection } from "@/app/_components/Container/ContainerSection";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { i18n } from "@/i18n";
import { useEffect, useRef } from "react";
import { NextJSSearchParams } from "@/types/types";

type MetaDataOverviewDeleteInfoBox = {
  searchParams: NextJSSearchParams;
};

export function MetaDataOverviewDeleteInfoBox({
  searchParams,
}: MetaDataOverviewDeleteInfoBox) {
  const divRef = useRef<HTMLDivElement>(null);

  const title = searchParams.title;
  const variant = searchParams.deleteResult;

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  if (
    !variant ||
    !title ||
    Array.isArray(variant) ||
    Array.isArray(title) ||
    !title.trim() ||
    (variant !== "success" && variant !== "error")
  ) {
    return null;
  }

  return (
    <ContainerSection containerWidth="lg">
      <InfoBox
        ref={divRef}
        variant={variant}
        title={i18n.t(`metadataoverview.delete.${variant}.title`, { title })}
        className="mt-5"
      ></InfoBox>
    </ContainerSection>
  );
}
