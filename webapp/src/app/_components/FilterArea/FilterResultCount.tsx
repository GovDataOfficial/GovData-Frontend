import { numberToLocaleString } from "@/app/_lib/number";

export function FilterResultCount({ count }: { count: number }) {
  return (
    <span className="gd-badge">
      {numberToLocaleString(count)}
      <span className="sr-only"> Treffer</span>
    </span>
  );
}
