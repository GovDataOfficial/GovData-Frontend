import Image from "next/image";

import { MenuItem } from "@/app/_components/MenuItem/MenuItem";
import { menuSettings } from "@/configuration/menuSettings";
import { i18n } from "@/i18n";
import { NavbarToggleButton } from "@/app/_components/Header/NavbarToggleButton";
import React from "react";
import { GlobalIds } from "@/app/_lib/globalIds";

export function HeaderNavigation() {
  return (
    <div className="container-lg">
      <div className="row">
        <div className="col-sm-12">
          <nav
            aria-label={i18n.t("header.navigation.label")}
            className="gd-navbar"
            id={GlobalIds.navigation}
          >
            <div className="d-flex justify-content-between align-items-center">
              <a className="gd-navbar-brand" href="/">
                <Image
                  alt={i18n.t("header.navigation.mainPage")}
                  height="50"
                  src="/images/logo.png"
                  width="191"
                />
              </a>
              <ul className="gd-navbar-nav d-none d-md-flex" role="menubar">
                {menuSettings.map((data) => (
                  <MenuItem key={data.name} {...data} />
                ))}
              </ul>
              <NavbarToggleButton />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
