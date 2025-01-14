import { Button } from "@/app/_components/Button/Button";
import { icons } from "@/app/_components/SVG/iconMap";
import { SVG } from "@/app/_components/SVG/SVG";
import { useCopyToClipboard } from "@/app/_lib/hooks/useCopyToClipboard";
import { i18n } from "@/i18n";

export function ResurceTableCopyToClipboardButton({ url }: { url: string }) {
  const { text, copyToClipboard } = useCopyToClipboard(
    i18n.t("resources.table.row.resource.copy"),
  );

  return (
    <Button
      variant="a"
      onClick={() => copyToClipboard(url)}
      className="d-flex mb-4 mx-auto text-wrap"
    >
      <SVG icon={icons.copy} size="big" />
      <span>{text}</span>
    </Button>
  );
}
