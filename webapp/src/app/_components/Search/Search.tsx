import { i18n } from "@/i18n";
import { SearchField } from "@/app/_components/Search/SearchField";
import { Background } from "@/app/_components/Background/Background";
import { SearchSecondaryLinks } from "@/app/_components/Search/SearchSecondaryLinks";
import { Suspense } from "react";

type SearchProps = {
  withTeaser?: boolean;
  backgroundImage?: Background["backgroundImage"];
  keepFiltersForSearch?: boolean;
};

export default function Search({
  withTeaser,
  backgroundImage,
  keepFiltersForSearch = false,
}: SearchProps) {
  const { t } = i18n;
  return (
    <Suspense>
      <Background backgroundImage={backgroundImage}>
        <form action="/suche" id="searchfieldform" method="get">
          {withTeaser && (
            <div className="container-lg gx-0 gx-sm-4">
              <div className="pt-2_5 pt-md-2">
                <div className="col-12">
                  <h1 className="maintitle">{t("page.home.headline")}</h1>
                  <p className="h2 maintitle-teaser">{t("page.home.teaser")}</p>
                </div>
              </div>
            </div>
          )}
          <div
            className={`gd-search-searchbox ${withTeaser ? "py-8" : "py-4"} px-2  `}
          >
            <div className="gd-search-searchbox-row-main">
              <SearchField keepFiltersForSearch={keepFiltersForSearch} />
              <div className="gd-search-submit">
                <button className="button-search" type="submit" title="Suchen">
                  <span className="d-none d-sm-block">
                    {t("search.button.title")}
                  </span>
                  <span className="d-inline-block d-sm-none sr-only">
                    {t("search.button.title")}
                  </span>
                  <span className="d-inline-block d-sm-none sbi-lupe"></span>
                </button>
              </div>
            </div>
            <SearchSecondaryLinks />
          </div>
        </form>
      </Background>
    </Suspense>
  );
}
