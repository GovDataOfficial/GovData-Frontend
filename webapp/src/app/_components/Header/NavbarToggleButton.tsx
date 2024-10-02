"use client";

import { showOffCanvas } from "@/app/_components/OffCanvasMenu";

export function NavbarToggleButton() {
  return (
    <button
      aria-controls="off-canvas"
      aria-expanded="false"
      title={"Seitennavigation ausklappen"}
      onClick={() => showOffCanvas("mainmenu")}
      className="gd-navbar-toggle d-flex d-md-none"
    >
      <i className="icon-reorder fa-solid"></i>
    </button>
  );
}
