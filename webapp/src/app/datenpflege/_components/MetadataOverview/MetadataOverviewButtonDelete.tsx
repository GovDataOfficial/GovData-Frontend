import { Button } from "@/app/_components/Button/Button";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { i18n } from "@/i18n";

type MetadataOverviewButtonDelete = {
  dataTitle: string;
  id: string;
};

export function MetadataOverviewButtonDelete({
  dataTitle,
  id,
}: MetadataOverviewButtonDelete) {
  const { t } = i18n;

  async function confirmAndDelete() {
    const userConfirmed = window.confirm(
      t("metadataoverview.table.delete.confirm", { title: dataTitle }),
    );

    if (userConfirmed) {
      const deleteUrl = `${API_ENDPOINTS.METADATA.DELETE}/${id}`;
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      const searchParams = new URLSearchParams({});

      if (response.ok) {
        searchParams.set("deleteResult", "success");
      } else {
        switch (response.status) {
          case 404:
            searchParams.set("deleteResult", "success");
            break;
          default:
            searchParams.set("deleteResult", "error");
        }
      }
      window.location.assign(
        `${PAGES_AUTH.manage_data}?title=${encodeURIComponent(dataTitle)}&${searchParams.toString()}`,
      );
    }
  }

  // should this be a button? a progressive enhanced anchor would be better
  return (
    <Button variant="a" title={dataTitle} onClick={() => confirmAndDelete()}>
      <SVG icon={icons.trash} />
      {t("metadataoverview.table.delete")}
    </Button>
  );
}
