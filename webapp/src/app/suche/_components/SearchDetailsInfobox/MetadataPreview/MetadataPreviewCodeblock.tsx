import Prism from "prismjs";

// supported languages
import "prismjs/components/prism-turtle";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-json";
// theme
import "prismjs/themes/prism-okaidia.css";
// plugin for line numbers
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import { useEffect, useRef } from "react";

import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";
import { i18n } from "@/i18n";

const getlanguageForSuffix = (suffix: MetadataPreviewFileSuffix): string => {
  const languageMap: Record<string, string> = {
    [MetadataPreviewFileSuffix.TURTLE]: "turtle",
    // synonym for xml
    [MetadataPreviewFileSuffix.RDF_XML]: "markup",
    [MetadataPreviewFileSuffix.JSON_LD]: "json",
  };

  return languageMap[suffix] || "markup";
};

export type MetadataPreviewCodeblock = {
  suffix: MetadataPreviewFileSuffix;
  codeContent?: string;
};

export function MetadataPreviewCodeblock({
  suffix,
  codeContent,
}: MetadataPreviewCodeblock) {
  const { t } = i18n;
  const ref = useRef<HTMLElement | null>(null);
  const language = getlanguageForSuffix(suffix);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [codeContent]);

  return (
    <pre className="line-numbers">
      <code ref={ref} className={`language-${language}`}>
        {codeContent
          ? codeContent
          : t("search.details.infobox.metaDataDownload.modal.noContent")}
      </code>
    </pre>
  );
}
