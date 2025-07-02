import { Button } from "@/app/_components/Button/Button";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { debounce } from "@/app/_lib/debounce";
import { i18n } from "@/i18n";

type OverviewButtonDelete = {
  dataTitle: string;
  id: string;
  apiEndpoint: string;
  url: string;
  deleteConfirmText: string;
};

export function OverviewButtonDelete({
  dataTitle,
  id,
  apiEndpoint,
  url,
  deleteConfirmText,
}: OverviewButtonDelete) {
  const { t } = i18n;

  // wait for searchindex to update before routing
  const routeToOverview = debounce((url: string) => {
    window.location.assign(url);
  }, 800);

  async function confirmAndDelete() {
    const userConfirmed = window.confirm(deleteConfirmText);

    if (userConfirmed) {
      const deleteUrl = `${apiEndpoint}/${id}`;
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

      routeToOverview(
        `${url}?title=${encodeURIComponent(dataTitle)}&${searchParams.toString()}`,
      );
    }
  }

  // should this be a button? a progressive enhanced anchor would be better
  return (
    <Button variant="a" title={dataTitle} onClick={() => confirmAndDelete()}>
      <SVG icon={icons.trash} />
      {t("overview.table.delete")}
    </Button>
  );
}
