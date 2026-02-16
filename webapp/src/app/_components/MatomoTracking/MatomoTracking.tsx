import { useMemo } from "react";

import { Matomo } from "@/app/_components/MatomoTracking/Matomo";

/**
 * Wrapper function so we can read in vars on server
 *
 * see: https://developer.matomo.org/guides/tracking-javascript-guide
 */
export function MatomoTracking() {
  const url = process.env.matomo_tracker_url;
  const siteId = process.env.matomo_site_id;
  const options = useMemo(() => parseOption(process.env.matomo_options), []);

  return url && siteId ? (
    <Matomo url={url} siteId={siteId} options={options} />
  ) : null;
}

function parseOption(env: string | undefined): string[][] {
  try {
    const parsedEnv: string[][] = env && JSON.parse(env);
    if (Array.isArray(parsedEnv)) {
      return parsedEnv;
    }
    return [];
  } catch (e) {
    throw Error(`could not JSON parse ${env}`);
  }
}
