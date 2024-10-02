"use client";

import { i18n } from "@/i18n";
import { MenuItem } from "@/app/_components/MenuItem/MenuItem";
import { OffCanvasCloseButton } from "@/app/_components/OffCanvasMenu/OffCanvasCloseButton";
import { useEffect, KeyboardEvent } from "react";
import { hideOffCanvas } from "@/app/_components/OffCanvasMenu/offCanvasHelper";
import { MenuItemMobile } from "@/app/_components/MenuItem/MenuItemMobile";

type OffCanvasMenuContainer = {
  menuItem?: MenuItem[];
  // need to pass menu settings from outside as this is client component,
  // and menu settings depend on process env.
  menuSettings: MenuItem[];
};

function closeOnBigBreakpoints(e: Event) {
  const target = e.target as Window;
  if (target.innerWidth >= 1024) {
    hideOffCanvas();
  }
}

function closeOnEscape(e: KeyboardEvent<HTMLDivElement>) {
  if (e.key === "Escape") {
    hideOffCanvas();
  }
}

export function OffCanvasMenuContainer({
  menuItem,
  menuSettings,
}: OffCanvasMenuContainer) {
  useEffect(() => {
    window.addEventListener("resize", closeOnBigBreakpoints);
    return () => {
      window.removeEventListener("resize", closeOnBigBreakpoints);
    };
  }, []);

  return (
    <nav
      className="gd-offcanvas"
      id="off-canvas"
      onKeyDown={closeOnEscape}
      aria-hidden={true}
    >
      <span className="offscreen">{i18n.t("header.offcanvas.title")}</span>
      <div className="off-canvas-inner-wrap">
        <OffCanvasCloseButton />
        <div className="off-canvas-container" id="off-canvas-filter" />
        <div className="off-canvas-container" id="off-canvas-mainmenu">
          <ul
            aria-label={i18n.t("header.offcanvas.nav.title")}
            className="off-canvas-nav"
            role="menubar"
          >
            {menuSettings.map((data) => {
              const { subMenu } = data;

              return (
                <MenuItemMobile
                  key={data.name}
                  {...data}
                  subMenu={data.href === "/informationen" ? menuItem : subMenu}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
