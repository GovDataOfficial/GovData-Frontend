import { usePathname, useSearchParams } from "next/navigation";

import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { i18n } from "@/i18n";

export function formatTimestampForUser(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return i18n.t("time.format.dateTime", {
    date: `${day}.${month}.${year}`,
    time: `${hours}:${minutes}:${seconds}`,
    oClock: i18n.t("time.oClock"),
  });
}

export function useLoginRedirect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = search ? `${pathname}?${search}` : pathname;
  const loginUrl = `${API_ENDPOINTS.AUTH.LOGIN}?redirectTo=${encodeURIComponent(currentPath)}`;

  return { loginUrl, currentPath };
}
