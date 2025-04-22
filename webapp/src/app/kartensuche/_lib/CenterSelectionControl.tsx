/**
 * A custom OpenLayers control for center selection.
 *
 * This control creates a button with a specified title and icon. When the button is clicked or touched,
 * it triggers the provided `centerSelection` callback function.
 *
 * @class CenterSelectionControl
 * @extends {Control}
 *
 * @param {() => void} centerSelection - The callback function to be executed when the button is clicked or touched.
 * @param {string} buttonTitle - The title attribute for the button, which is displayed as a tooltip.
 * @param {Options} [opt_options] - Optional configuration options for the control.
 */
import Control, { Options } from "ol/control/Control";

import { i18n } from "@/i18n";

export class CenterSelectionControl extends Control {
  constructor(centerSelection: () => void, opt_options?: Options) {
    const options = opt_options || {};

    const button = document.createElement("button");
    button.type = "button"; // prevent form submit
    button.innerHTML =
      '<i class="icon-map-marker fa-location-dot fa-solid"></i>';
    button.title = i18n.t("searchmap.map.centerSelection");
    button.addEventListener("click", centerSelection, false);
    button.addEventListener("touchstart", centerSelection, false);

    const element = document.createElement("div");
    element.className = "center-selection-control ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });
  }
}
