export type ActivityIndicator = {
  size?: "small" | "large";
  label?: string;
  className?: string;
};

/**
 * Web counterpart of React Native's `ActivityIndicator`.
 * Renders an animated spinner that is announced to assistive technology via `label`.
 */
export function ActivityIndicator({
  size = "small",
  label,
  className,
}: ActivityIndicator) {
  const classList = ["activity-indicator", `activity-indicator-${size}`];
  if (className) {
    classList.push(className);
  }

  return (
    <span role="status" aria-label={label} className={classList.join(" ")} />
  );
}
