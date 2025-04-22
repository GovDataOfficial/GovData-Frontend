import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { ResourcesTable } from "@/app/suche/_components/ResourceTable/ResourcesTable";
import { ResourceTableMobile } from "@/app/suche/_components/ResourceTable/ResourceTableMobile";
import { i18n } from "@/i18n";
import { Metadata } from "@/types/types";

type SectionResources = {
  data: Metadata;
  tileUrl: string;
};

export function SectionResources({ data, tileUrl }: SectionResources) {
  if (!data.resources || data.resources?.length == 0) {
    return null;
  }

  return (
    <DesignBox>
      <h2 className="mt-1">{i18n.t("resources.headline")}</h2>
      <ResourcesTable data={data} tileUrl={tileUrl} />
      <ResourceTableMobile data={data} tileUrl={tileUrl} />
    </DesignBox>
  );
}
