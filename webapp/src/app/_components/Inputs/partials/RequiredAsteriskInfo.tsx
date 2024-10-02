import React from "react";
import { i18n } from "@/i18n";
type RequiredAsteriskInfo = {
  className?: string;
};
export function RequiredAsteriskInfo({ className }: RequiredAsteriskInfo) {
  return (
    <div aria-hidden="true" className={className}>
      {i18n.t("contact.page.form.requiredFields")}
    </div>
  );
}
