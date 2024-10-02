import { PropsWithChildren } from "react";
import InfoIcon from "../../../../public/images/info-blue.svg";
import Image from "next/image";

type InfoBadge = PropsWithChildren<{
  className?: string;
}>;

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
