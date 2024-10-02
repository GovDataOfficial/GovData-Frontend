const formatDate = (date: string, format?: Intl.DateTimeFormatOptions) => {
  const opts = format || {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("de-DE", opts);
};

type Time = {
  date: string;
  format?: Intl.DateTimeFormatOptions;
};

export function Time({ date, format }: Time) {
  return <time dateTime={date}>{formatDate(date, format)}</time>;
}
