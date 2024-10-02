import { PropsWithChildren } from "react";

export function AlertBadge({ children }: PropsWithChildren) {
  return (
    <div role="alert" className="alert gd-alert-danger">
      {children}
    </div>
  );
}
