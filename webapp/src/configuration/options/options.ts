import { customConfigurationOptions } from "@/configuration/options/options.custom";
import { defaultConfigurationOptions } from "@/configuration/options/options.default";
import { ConfigurationOptions } from "@/configuration/options/types";

let cachedOptions: ConfigurationOptions | null = null;

export function getConfigurationOptions() {
  if (cachedOptions) {
    return cachedOptions;
  }
  cachedOptions = {
    ...defaultConfigurationOptions,
    ...customConfigurationOptions,
  };
  return cachedOptions;
}
