import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
  METADATA_FORM_MAX_LENGTH_SMALL,
} from "@/app/datenpflege/_components/MetadataForm/formConstants";
import { MetadataFormStepContacts } from "@/app/datenpflege/_components/MetadataForm/steps/contacts/MetadataFormStepContacts";
import { MetadataContact, MetadataContactRole } from "@/types/types";

vi.mock("@/app/_components/SVG/SVG", () => ({
  icons: { trash: "trash", plus: "plus" },
  SVG: ({ icon }: { icon: string }) => <span>{icon}</span>,
}));

const emptyPublisherContact = {
  name: "",
  email: "",
  url: "",
  address: {
    addressee: "",
    details: "",
    street: "",
    zip: "",
    country: "",
  },
  role: MetadataContactRole.publisher,
};

describe("MetadataFormStepContacts", () => {
  const stepProps = {
    forStep: 0,
    currentStep: 0,
  };

  const getNameFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /name/i });

  const getEmailFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /e-mail/i });

  const getWebsiteFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: "Webseite (empfohlen)" });

  const getAddresseeFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /adressat/i });

  const getDetailsFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /zusatz/i });

  const getStreetFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /straße/i });

  const getPlzFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /plz/i });

  const getCountryFieldIn = (group: HTMLElement) =>
    within(group).getByRole("textbox", { name: /land/i });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  test("should render correct markup", async () => {
    render(
      <MetadataFormStepContacts
        {...stepProps}
        defaultContacts={[emptyPublisherContact]}
      />,
    );

    screen.getByRole("heading", { name: "Kontakte", level: 2 });

    const publisherGroup = screen.getByRole("group", {
      name: /veröffentlichende stelle/i,
    });

    expect(publisherGroup).toHaveAttribute("id", "contact-publisher");

    // check all inputs in publisher publisherGroup, all publisherGroups are the same
    const PUBLISHER_INPUTS = METADATA_FORM_INPUTS.CONTACTS(
      MetadataContactRole.publisher,
    );

    const name = getNameFieldIn(publisherGroup);
    expect(name).toHaveAttribute("name", PUBLISHER_INPUTS.name);
    expect(name).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const email = getEmailFieldIn(publisherGroup);
    expect(email).toHaveAttribute("name", PUBLISHER_INPUTS.email);
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const website = getWebsiteFieldIn(publisherGroup);
    expect(website).toHaveAttribute("name", PUBLISHER_INPUTS.url);
    expect(website).toHaveAttribute("type", "url");
    expect(website).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const addressee = getAddresseeFieldIn(publisherGroup);
    expect(addressee).toHaveAttribute(
      "name",
      PUBLISHER_INPUTS.address.addressee,
    );
    expect(addressee).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const details = getDetailsFieldIn(publisherGroup);
    expect(details).toHaveAttribute("name", PUBLISHER_INPUTS.address.details);
    expect(details).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const street = getStreetFieldIn(publisherGroup);
    expect(street).toHaveAttribute("name", PUBLISHER_INPUTS.address.street);
    expect(street).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const plz = getPlzFieldIn(publisherGroup);
    expect(plz).toHaveAttribute("name", PUBLISHER_INPUTS.address.zip);
    expect(plz).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const country = getCountryFieldIn(publisherGroup);
    expect(country).toHaveAttribute("name", PUBLISHER_INPUTS.address.country);
    expect(country).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_SMALL.toString(),
    );
  });

  test("should render inputs with prefilled data", () => {
    const creator = {
      name: "Test",
      email: "test@test.de",
      url: "http://test.de",
      address: {
        addressee: "test-addressee",
        details: "test-details",
        street: "test-street",
        zip: "test-zip",
        country: "test-country",
      },
      role: MetadataContactRole.creator,
    } satisfies MetadataContact;

    render(
      <MetadataFormStepContacts {...stepProps} defaultContacts={[creator]} />,
    );

    const creatorGroup = screen.getByRole("group", { name: /autor/i });

    expect(getNameFieldIn(creatorGroup)).toHaveDisplayValue("Test");
    expect(getEmailFieldIn(creatorGroup)).toHaveDisplayValue("test@test.de");
    expect(getWebsiteFieldIn(creatorGroup)).toHaveDisplayValue(
      "http://test.de",
    );
    expect(getAddresseeFieldIn(creatorGroup)).toHaveDisplayValue(
      "test-addressee",
    );
    expect(getDetailsFieldIn(creatorGroup)).toHaveDisplayValue("test-details");
    expect(getStreetFieldIn(creatorGroup)).toHaveDisplayValue("test-street");
    expect(getPlzFieldIn(creatorGroup)).toHaveDisplayValue("test-zip");
    expect(getCountryFieldIn(creatorGroup)).toHaveDisplayValue("test-country");
  });

  test("should remove a contact", async () => {
    const user = userEvent.setup();

    render(
      <MetadataFormStepContacts
        {...stepProps}
        defaultContacts={[emptyPublisherContact]}
      />,
    );

    const deletePublisherButton = screen.getByRole("button", {
      name: /veröffentlichende stelle löschen/i,
    });

    await user.click(deletePublisherButton);

    expect(
      screen.queryByRole("group", { name: /veröffentlichende stelle/i }),
    ).not.toBeInTheDocument();
  });

  test("should not remove a contact if not confirmed", async () => {
    render(
      <MetadataFormStepContacts
        {...stepProps}
        defaultContacts={[emptyPublisherContact]}
      />,
    );
    vi.spyOn(window, "confirm").mockImplementation(() => false);
    const user = userEvent.setup();

    const deletePublisherButton = screen.getByRole("button", {
      name: /veröffentlichende stelle löschen/i,
    });

    await user.click(deletePublisherButton);

    expect(
      screen.queryByRole("group", { name: /veröffentlichende stelle/i }),
    ).toBeInTheDocument();
  });

  test("should add a contact", async () => {
    render(<MetadataFormStepContacts {...stepProps} />);
    const user = userEvent.setup();

    const addCreatorButton = screen.getByRole("button", {
      name: /autor hinzufügen/i,
    });

    expect(addCreatorButton).toHaveAttribute(
      "id",
      "add-contact-button-creator",
    );

    await user.click(addCreatorButton);
    screen.getByRole("group", { name: /autor/i });
  });

  test("should show live region message after delete", async () => {
    render(
      <MetadataFormStepContacts
        {...stepProps}
        defaultContacts={[emptyPublisherContact]}
      />,
    );
    const user = userEvent.setup();

    const deletePublisherButton = screen.getByRole("button", {
      name: /veröffentlichende stelle löschen/i,
    });

    await user.click(deletePublisherButton);

    const srOnlyText = screen.getByText(
      "Kontakt Veröffentlichende Stelle gelöscht",
    );
    expect(srOnlyText).toHaveClass("sr-only");
  });

  test("should show live region message after add", async () => {
    render(<MetadataFormStepContacts {...stepProps} />);
    const user = userEvent.setup();

    const addCreatorButton = screen.getByRole("button", {
      name: /autor hinzufügen/i,
    });
    await user.click(addCreatorButton);

    const srOnlyText = screen.getByText("Kontakt Autor hinzugefügt");
    expect(srOnlyText).toHaveClass("sr-only");
  });

  test("should focus add button after delete", async () => {
    render(
      <MetadataFormStepContacts
        {...stepProps}
        defaultContacts={[emptyPublisherContact]}
      />,
    );
    const user = userEvent.setup();

    const deletePublisherButton = screen.getByRole("button", {
      name: /veröffentlichende stelle löschen/i,
    });

    await user.click(deletePublisherButton);

    const addPublisherButton = screen.getByRole("button", {
      name: /veröffentlichende stelle hinzufügen/i,
    });
    expect(addPublisherButton).toHaveFocus();
  });

  test("should focus first input of the contact form after add", async () => {
    render(<MetadataFormStepContacts {...stepProps} />);
    const user = userEvent.setup();

    const addCreatorButton = screen.getByRole("button", {
      name: /autor hinzufügen/i,
    });
    await user.click(addCreatorButton);

    const creatorGroup = screen.getByRole("group", { name: /autor/i });
    const firstInput = within(creatorGroup).getByRole("textbox", {
      name: /name/i,
    });
    expect(firstInput).toHaveFocus();
  });
});
