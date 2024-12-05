import { i18n } from "@/i18n";

type TimeWithDate = {
  date?: string;
  direction?: "row" | "column";
};

export function TimeWithDate({ date, direction = "column" }: TimeWithDate) {
  const { t } = i18n;

  if (!date || isNaN(Date.parse(date))) {
    return (
      <>
        <span className="sr-only">{t("time.notAvailable")}</span>
        <span aria-hidden>-</span>
      </>
    );
  }

  const dateObject = new Date(date);
  return (
    <div className="time-with-date">
      <time dateTime={date} className={`time-with-date-${direction}`}>
        <span>
          {dateObject.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
        <span>
          {dateObject.toLocaleTimeString("de-DE", {
            timeStyle: "short",
          })}
          &nbsp;{t("time.oClock")}
        </span>
      </time>
    </div>
  );
}
