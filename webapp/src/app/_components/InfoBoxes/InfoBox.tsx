import React, { PropsWithChildren } from "react";

type InfoBox = PropsWithChildren<{
  title: string;
  variant?: "info" | "success" | "error";
  titleId?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}>;

const InfoBox = ({
  ref,
  title,
  variant = "info",
  className = "",
  children,
}: InfoBox) => {
  return (
    <div
      className={`info-box info-box-${variant} ${className}`}
      role={variant === "error" ? "alert" : "status"}
      tabIndex={-1}
      ref={ref}
    >
      <div className="d-flex flex-nowrap">
        <div>
          <p className="m-0">
            <span className="info-box-message">{title}</span>
          </p>
          {children && <p className="mb-0">{children}</p>}
        </div>
      </div>
    </div>
  );
};

InfoBox.displayName = "InfoBox";

export { InfoBox };
