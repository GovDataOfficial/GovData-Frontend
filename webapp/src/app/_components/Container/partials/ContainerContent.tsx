import { PropsWithChildren } from "react";

export function ContainerContent({ children }: PropsWithChildren) {
  return (
    <div className="row">
      <div className="col-12">{children}</div>
    </div>
  );
}
