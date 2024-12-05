import React, { forwardRef, PropsWithChildren } from "react";

type InfoBox = {
  title: string;
  variant?: "info" | "success" | "error";
  titleId?: string;
  className?: string;
};

const InfoBox = forwardRef<HTMLDivElement, PropsWithChildren<InfoBox>>(
  (
    {
      title,
      variant = "info",
      className = "",
      children,
    }: PropsWithChildren<InfoBox>,
    ref,
  ) => {
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
  },
);

InfoBox.displayName = "InfoBox";

export { InfoBox };
