import React from "react";

import { Button } from "@/app/_components/Button/Button";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

type ShowcaseFormBottomNavigation = {
  submitButtonTitle: string;
};

export function ShowcaseFormBottomNavigation({
  submitButtonTitle,
}: ShowcaseFormBottomNavigation) {
  return (
    <div className="form-bottom-navigation">
      <a href={PAGES_AUTH.manage_showcases} className="align-content-center">
        {i18n.t("showcaseform.navigation.cancel")}
      </a>

      <Button id="showcase-form-submit-button" type="submit" variant="primary">
        {submitButtonTitle}
      </Button>
    </div>
  );
}
