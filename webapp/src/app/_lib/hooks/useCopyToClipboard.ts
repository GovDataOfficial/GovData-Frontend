import { useState } from "react";

import { debounce } from "@/app/_lib/debounce";
import { i18n } from "@/i18n";

export function useCopyToClipboard(copyToClipboardText: string) {
  const [text, setText] = useState(copyToClipboardText);

  const resetText = debounce(() => {
    setText(copyToClipboardText);
  }, 2000);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setText(i18n.t("button.copyToClipboard.success"));
    resetText();
  };

  return {
    text,
    copyToClipboard,
  };
}
