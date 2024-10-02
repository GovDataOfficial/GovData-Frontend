import { ShowCaseData } from "@/types/types";
import { i18n } from "@/i18n";
import { SearchDetailsInfoBoxGroup } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxGroup";
import { TermCategories } from "@/app/suche/_components/SearchDetailsInfobox/partials/TermCategories";
import { DLTags } from "@/app/suche/_components/SearchDetailsInfobox/partials/DLTags";
import { SearchDetailsInfoBoxContainer } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxContainer";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";

type SearchDetailsInfoboxDataset = {
  data: ShowCaseData;
};

export function SearchDetailsInfoboxApplication({
  data,
}: SearchDetailsInfoboxDataset) {
  const { t } = i18n;

  const { showcaseTypes, contact, categories, keywords, platforms } = data;

  const hasCategories = categories?.length > 0;
  const hasPlatforms = platforms?.length > 0;
  return (
    <SearchDetailsInfoBoxContainer
      headline={t("search.details.infobox.headline.application")}
    >
      <dl>
        <SearchDetailsInfoBoxGroup inline>
          <dt>{t("filter.showcase_types.title")}</dt>
          {showcaseTypes.map((a) => (
            <dd key={a.name}>{t("filter.showcase_types." + a.name)}</dd>
          ))}
        </SearchDetailsInfoBoxGroup>

        {hasPlatforms && (
          <SearchDetailsInfoBoxGroup inline>
            <dt>{t("filter.platforms.title")}</dt>
            {platforms.map((platform) => (
              <dd key={platform.id}>
                {t("filter.platforms." + platform.name)}
              </dd>
            ))}
          </SearchDetailsInfoBoxGroup>
        )}

        {contact && (
          <SearchDetailsInfoBoxGroup>
            <dt>{t("search.details.infobox.contact")}</dt>
            {contact.name && <dd>{contact.name}</dd>}
            {contact.addressReceiver && <dd>{contact.addressReceiver}</dd>}
            {contact.addressExtras && <dd>{contact.addressExtras}</dd>}
            {contact.addressStreet && <dd>{contact.addressStreet}</dd>}
            {contact.addressCity && <dd>{contact.addressCity}</dd>}
            {contact.addressCountry && <dd>{contact.addressCountry}</dd>}
            {contact.email && (
              <dd>
                {t("search.details.infobox.contact.email")}:&nbsp;
                <a href={"mailto:" + contact.email}>{contact.email}</a>
              </dd>
            )}
            {contact.website && (
              <dd>
                {t("search.details.infobox.contact.website")}:&nbsp;
                <ExternalLink
                  href={contact.website}
                  title={contact.website}
                  className="d-inline-block"
                />
              </dd>
            )}
          </SearchDetailsInfoBoxGroup>
        )}
        {hasCategories && (
          <SearchDetailsInfoBoxGroup>
            <TermCategories
              title={t("search.details.infobox.categories")}
              categories={categories.map((c) => c.name)}
            />
          </SearchDetailsInfoBoxGroup>
        )}
      </dl>
      <DLTags tags={keywords.map((keyword) => keyword.name)} />
    </SearchDetailsInfoBoxContainer>
  );
}
