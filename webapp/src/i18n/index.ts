import { createInstance, InitOptions } from "i18next";
import de from "@/i18n/locales/de.json";

const options: InitOptions = {
  supportedLngs: ["de"],
  fallbackLng: "de",
  defaultNS: "govdata",
  nsSeparator: "::",
  initImmediate: false,
  lng: "de",
  resources: {
    de,
  },
};

const i18n = createInstance(options, (error) => {
  if (error) {
    console.error("Translations could not be loaded.", error);
    return;
  }
});

export { i18n };
