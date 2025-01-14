import { PropsWithChildren } from "react";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

type MetadataQualityDesignBox = {
  title: string;
};

export function MetadataQualityDesignBox({
  title,
  children,
}: PropsWithChildren<MetadataQualityDesignBox>) {
  return (
    <DesignBox>
      <h2 className="chart-title text-center">{title}</h2>
      {children}
    </DesignBox>
  );
}
