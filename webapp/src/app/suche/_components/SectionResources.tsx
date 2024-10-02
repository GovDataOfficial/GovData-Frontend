import { MetaData } from "@/types/types";
import { ResourcesTable } from "@/app/suche/_components/ResourceTable/ResourcesTable";
import { ResourceTableMobile } from "@/app/suche/_components/ResourceTable/ResourceTableMobile";
import { i18n } from "@/i18n";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

type SectionResources = {
  data: MetaData;
};

export function SectionResources({ data }: SectionResources) {
  if (!data.resources || data.resources?.length == 0) {
    return null;
  }

  return (
    <DesignBox>
      <h2 className="mt-1">{i18n.t("resources.headline")}</h2>
      <ResourcesTable data={data} />
      <ResourceTableMobile data={data} />
    </DesignBox>
  );
}
