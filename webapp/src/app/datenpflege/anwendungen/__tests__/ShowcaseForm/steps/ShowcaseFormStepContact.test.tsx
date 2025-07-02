import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  SHOWCASE_FORM_INPUTS,
  SHOWCASE_FORM_MAX_LENGTH_MEDIUM,
  SHOWCASE_FORM_MAX_LENGTH_SMALL,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormStepContact } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/ShowcaseFormStepContact";
import { ShowcaseContact } from "@/types/types";

const emptyContact: ShowcaseContact = {
  name: "",
  email: "",
  website: "",
  addressReceiver: "",
  addressExtras: "",
  addressStreet: "",
  addressCity: "",
  addressPostalCode: "",
  addressCountry: "",
};

describe("ShowcaseFormStepContact", () => {
  const getNameField = () => screen.getByRole("textbox", { name: /name/i });

  const getEmailField = () => screen.getByRole("textbox", { name: /e-mail/i });

  const getWebsiteField = () =>
    screen.getByRole("textbox", { name: "Webseite" });

  const getAddresseeField = () =>
    screen.getByRole("textbox", { name: /adressat/i });

  const getDetailsField = () =>
    screen.getByRole("textbox", { name: /zusatz/i });

  const getStreetField = () => screen.getByRole("textbox", { name: /straße/i });

  const getPlzField = () => screen.getByRole("textbox", { name: /plz/i });

  const getCountryField = () => screen.getByRole("textbox", { name: /land/i });
  const getCityField = () => screen.getByRole("textbox", { name: /stadt/i });

  test("should render correct markup", async () => {
    render(<ShowcaseFormStepContact defaultContact={emptyContact} />);

    screen.getByRole("heading", { name: "Kontakt", level: 2 });

    const name = getNameField();
    expect(name).toHaveAttribute("name", SHOWCASE_FORM_INPUTS.CONTACT.name);
    expect(name).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const email = getEmailField();
    expect(email).toHaveAttribute("name", SHOWCASE_FORM_INPUTS.CONTACT.email);
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const website = getWebsiteField();
    expect(website).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.website,
    );
    expect(website).toHaveAttribute("type", "url");
    expect(website).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const addressee = getAddresseeField();
    expect(addressee).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.addressReceiver,
    );
    expect(addressee).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const details = getDetailsField();
    expect(details).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.addressExtras,
    );
    expect(details).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const street = getStreetField();
    expect(street).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.addressStreet,
    );
    expect(street).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const plz = getPlzField();
    expect(plz).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.addressPostalCode,
    );
    expect(plz).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const city = getCityField();
    expect(city).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.addressCity,
    );
    expect(city).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const country = getCountryField();
    expect(country).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CONTACT.addressCountry,
    );
    expect(country).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );
  });

  test("should render inputs with prefilled data", () => {
    const contact = {
      name: "Test",
      email: "test@test.de",
      website: "http://test.de",
      addressReceiver: "test-addressee",
      addressExtras: "test-details",
      addressStreet: "test-street",
      addressPostalCode: "test-zip",
      addressCity: "test-city",
      addressCountry: "test-country",
    } satisfies ShowcaseContact;

    render(<ShowcaseFormStepContact defaultContact={contact} />);

    expect(getNameField()).toHaveDisplayValue(contact.name);
    expect(getEmailField()).toHaveDisplayValue(contact.email);
    expect(getWebsiteField()).toHaveDisplayValue(contact.website);
    expect(getAddresseeField()).toHaveDisplayValue(contact.addressReceiver);
    expect(getDetailsField()).toHaveDisplayValue(contact.addressExtras);
    expect(getStreetField()).toHaveDisplayValue(contact.addressStreet);
    expect(getPlzField()).toHaveDisplayValue(contact.addressPostalCode);
    expect(getCityField()).toHaveDisplayValue(contact.addressCity);
    expect(getCountryField()).toHaveDisplayValue(contact.addressCountry);
  });
});
