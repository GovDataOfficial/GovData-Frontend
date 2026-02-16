import { InputCheckbox } from "@/app/_components/Inputs/InputCheckbox";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

export type PrivacyPolicyConsent = {
  mailAdress: string;
};

export function PrivacyPolicyConsent({ mailAdress }: PrivacyPolicyConsent) {
  const { t } = i18n;
  const mail = <a href={`mailto:${mailAdress}`}>{mailAdress}</a>;
  const link = (
    <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
      {t("privacyPolicy.page.title")}
    </a>
  );

  return (
    <div className="gd-input">
      <div className="mb-4">
        <Trans
          i18nKey={`contact.page.form.privacyPolicyConsentDescription`}
          params={{ mail }}
        />
      </div>
      <fieldset className="mb-4">
        <legend>
          {t("contact.page.form.privacyPolicyConsentLabel")}
          <strong aria-hidden="true">&nbsp;*</strong>
        </legend>
        <InputCheckbox
          name="privacyPolicy"
          label={t("contact.page.form.privacyPolicyConsentText")}
          required={true}
          defaultChecked={false}
        />
        <div>
          <Trans
            i18nKey={`contact.page.form.privacyPolicyConsentHint`}
            params={{ link }}
          />
        </div>
      </fieldset>
    </div>
  );
}
