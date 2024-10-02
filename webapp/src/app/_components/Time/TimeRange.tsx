import { Time } from "@/app/_components/Time/Time";
import { i18n } from "@/i18n";

export function TimeRange({ from, to }: { from: string; to: string }) {
  const { t } = i18n;

  return (
    <>
      <span className="sr-only">{t("time.range.from")}</span>
      <Time date={from} />
      <span aria-hidden>&nbsp;-&nbsp;</span>
      <span className="sr-only">{t("time.range.to")}</span>
      <Time date={to} />
    </>
  );
}
