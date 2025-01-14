import { ButtonIcon } from "@/app/_components/Button/ButtonIcon";
import { icons } from "@/app/_components/SVG/SVG";
import { useCopyToClipboard } from "@/app/_lib/hooks/useCopyToClipboard";
import { i18n } from "@/i18n";

export function CopyToClipboardButton({ url }: { url: string }) {
  const { text, copyToClipboard } = useCopyToClipboard(
    i18n.t("resources.table.row.resource.copy"),
  );

  return (
    <ButtonIcon
      onClick={() => copyToClipboard(url)}
      title={text}
      className="gd-button-copy-to-clipboard"
      icon={icons.copy}
      size="big"
    />
  );
}
