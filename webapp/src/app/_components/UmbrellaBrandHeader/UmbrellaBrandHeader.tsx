import Image from "next/image";

import { i18n } from "@/i18n";

import flagGermany from "./flag_germany.svg";

export function UmbrellaBrandHeader() {
  const showHeader = process.env.show_umbrella_brand_header;
  return showHeader && showHeader.toLowerCase() === "true" ? (
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
