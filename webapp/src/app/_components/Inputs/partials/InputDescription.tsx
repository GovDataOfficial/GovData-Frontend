import React, { PropsWithChildren } from "react";

export function InputDescription({ children }: PropsWithChildren) {
  return <p className="paragraph-small my-0">{children}</p>;
}
