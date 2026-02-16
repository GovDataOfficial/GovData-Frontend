import Image from "next/image";

import { isFeatureEnabled } from "@/app/_lib/features";
import { Feature } from "@/configuration/featureFlags/types";
import { i18n } from "@/i18n";

import flagGermany from "./flag_germany.svg";

export function UmbrellaBrandHeader() {
  const showHeader = isFeatureEnabled(Feature.showUmbrellaBrandHeader);
  return showHeader ? (
    <div className="gd-umbrella-brand-header-container">
      <div className="container-lg">
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex align-items-center">
              <Image
                src={flagGermany}
                alt={i18n.t("umbrellabrand.image")}
                unoptimized
                loading="eager"
                width={24}
                height={16}
              />
              <span className="ms-1 ms-sm-2">
                {i18n.t("umbrellabrand.text")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
