import { PropsWithChildren } from "react";
import Image from "next/image";

import InfoIcon from "../../../../public/images/info-blue.svg";

type InfoBadge = PropsWithChildren<{
  className?: string;
}>;

// TODO merge with InfoBox and remove alert-info classes
export function InfoBadge({ children, className = "" }: InfoBadge) {
  return (
    <div role="alert" className={`alert alert-info ${className}`}>
      <Image
        width={16}
        height={16}
        className="alert-icon"
        src={InfoIcon}
        alt=""
      />
      {children}
    </div>
  );
}
