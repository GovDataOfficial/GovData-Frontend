import { i18n } from "@/i18n";

export type PreviewLoading = {
  loadingText?: string;
};

export function PreviewLoading({ loadingText }: PreviewLoading) {
  return (
    <div className="search-details-preview-loading">
      <div className="d-flex flex-column align-items-center">
        <span className="spinner"></span>
        <span className="mt-2">
          {loadingText ? loadingText : i18n.t("search.details.preview.loading")}
        </span>
      </div>
    </div>
  );
}
