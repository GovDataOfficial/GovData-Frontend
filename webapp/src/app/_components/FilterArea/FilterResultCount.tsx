export function FilterResultCount({ count }: { count: number }) {
  const localCountString = count.toLocaleString();

  return (
    <span className="gd-badge">
      {localCountString}
      <span className="sr-only"> Treffer</span>
    </span>
  );
}
