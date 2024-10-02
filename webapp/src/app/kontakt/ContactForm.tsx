"use client";

import React, { useRef } from "react";
import { i18n } from "@/i18n";
import { Select } from "@/app/_components/Inputs/Select";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputEmail } from "@/app/_components/Inputs/InputEmail";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { Button } from "@/app/_components/Button/Button";
import { RequiredAsteriskInfo } from "@/app/_components/Inputs/partials/RequiredAsteriskInfo";

export function ContactForm() {
  const { t } = i18n;
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action={"/api/contact"} method="post" ref={formRef} className="mt-3">
      <RequiredAsteriskInfo />
      <div className="w-50 my-4">
        <Select label={t("contact.page.form.title")}>
          <option value="">{t("contact.page.form.title.option1")}</option>
          <option value="Frau">{t("contact.page.form.title.option2")}</option>
          <option value="Hett">{t("contact.page.form.title.option3")}</option>
        </Select>
      </div>
      <div className="w-50 mb-4">
        <InputText name="name" label={t("contact.page.form.name")} />
      </div>
      <div className="d-none">
        <InputEmail name="mail" label={t("contact.page.form.mail")} />
      </div>
      <div className="w-50 mb-4">
        <InputEmail
          name="mail2"
          required
          label={t("contact.page.form.mail")}
          customValidationMessage={t(
            "contact.page.form.mail.validationMessage",
          )}
        />
      </div>
      <div className="w-75 mb-4">
        <TextArea
          label={t("contact.page.form.message")}
          name="message"
          required
          maxLength={10000}
          customValidationMessage={t(
            "contact.page.form.message.validationMessage",
          )}
        />
      </div>
      <Button type={"submit"}>{t("contact.page.form.submit")}</Button>
    </form>
  );
}
