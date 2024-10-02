import { PropsWithChildren } from "react";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

type MetaDataQualityDesignBox = {
  title: string;
};

export function MetaDataQualityDesignBox({
  title,
  children,
}: PropsWithChildren<MetaDataQualityDesignBox>) {
  return (
    <DesignBox>
      <h2 className="chart-title text-center">{title}</h2>
      {children}
    </DesignBox>
  );
}
