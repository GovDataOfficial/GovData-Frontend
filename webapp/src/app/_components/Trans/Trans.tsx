import { i18n } from "@/i18n";
import { Fragment, ReactNode } from "react";

export type Trans = {
  id?: string;
  className?: string;
  i18nKey: string;
  htmlElement?: "paragraph";
  params?: { [key: string]: string | ReactNode };
};

/**
 * use like:
 *
 * <Trans i18nKey="my.key" params="{component: <div className='foo' />}">
 *   with translations "my.key": "this will {{component}} interpolated safely"
 */
export const Trans = function ({
  id,
  className,
  i18nKey,
  params = {},
  htmlElement,
}: Trans) {
  const translation: string | undefined = i18n.getResource(
    "de",
    "govdata",
    i18nKey,
  );
  const arrayWithMarkers = translation?.match(/{{.*?}}|[^{]+/g) || [i18nKey];

  const mappedMarkers = arrayWithMarkers?.map((match) => {
    if (!match.includes("}}")) {
      return match;
    }
    const matchClearName = match.replaceAll(/({{|}})/g, "");
    return params[matchClearName] || match;
  });

  const mappedWithKeys = mappedMarkers?.map((child, index) => (
    <Fragment key={index}>{child}</Fragment>
  ));

  switch (htmlElement) {
    case "paragraph":
      return (
        <p id={id} className={className}>
          {mappedWithKeys}
        </p>
      );

    default:
      return mappedMarkers;
  }
};
