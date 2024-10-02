import { NextJSSearchParams } from "@/types/types";
import { ReadonlyURLSearchParams } from "next/navigation";

export type ValidSearchParamsForConversion =
  | NextJSSearchParams
  | URLSearchParams
  | ReadonlyURLSearchParams;

export function convertToURLSearchParams(
  searchParams: ValidSearchParamsForConversion,
): URLSearchParams {
  if (searchParams instanceof URLSearchParams) {
    return new URLSearchParams(searchParams);
  }

  const params = new URLSearchParams();
  Object.entries(searchParams || {}).map(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => params.append(key, val));
    } else {
      value && params.append(key, value);
    }
  });
  return params;
}
