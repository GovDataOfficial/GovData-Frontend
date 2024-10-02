import { Matomo } from "@/app/_components/MatomoTracking/Matomo";

/**
 * Wrapper function so we can read in vars on server
 *
 * see: https://developer.matomo.org/guides/tracking-javascript-guide
 */
export function MatomoTracking() {
  const url = process.env.matomo_tracker_url;
  const siteId = process.env.matomo_site_id;

  return url && siteId ? <Matomo url={url} siteId={siteId} /> : null;
}
