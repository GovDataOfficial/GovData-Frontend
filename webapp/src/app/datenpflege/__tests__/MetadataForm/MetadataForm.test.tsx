import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  METADATA_FORM_ID,
  METADATA_FORM_INPUTS,
} from "@/app/datenpflege/_components/MetadataForm/formConstants";
import { MetadataForm } from "@/app/datenpflege/_components/MetadataForm/MetadataForm";
import { OrganizationSorted } from "@/types/types";

describe("MetadataForm", () => {
  const { useRouter, mockedRouterPush } = vi.hoisted(() => {
    const mockedRouterPush = vi.fn();
    return {
      useRouter: () => ({ push: mockedRouterPush }),
      mockedRouterPush,
    };
  });

  vi.mock("next/navigation", async () => {
    return {
      useRouter,
    };
  });

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  const organizations = [
    {
      id: "org1",
      displayName: "Org 1",
      contributorIds: ["contrib1", "contrib2"],
    },
    {
      id: "org2",
      displayName: "Org 2",
      contributorIds: ["contrib3", "contrib4"],
    },
  ] as OrganizationSorted;

  const licenses = [
    { id: "license1", title: "license1", url: "http://example.com" },
  ];

  const commonLinks = {
    metadataDcatapLink: "http://example.com#dcatap",
    metadataGuideLink: "http://example.com#leitfaden",
    mailFitko: "mail:fit@ko.de",
  };

  const validMetadata = {} as any;
  validMetadata[METADATA_FORM_INPUTS.ID] = "test";
  validMetadata[METADATA_FORM_INPUTS.ORGANIZATION_ID] = organizations[0].id;
  validMetadata.notes = "a note";
  validMetadata[METADATA_FORM_INPUTS.CONTRIBUTOR_ID] =
    organizations[0].contributorIds[0];
  validMetadata[METADATA_FORM_INPUTS.TITLE] = "a title";
  validMetadata.resources = [
    { url: "http://example.com", licenseId: licenses[0].id },
  ];
  validMetadata.contacts = [
    {
      email: "test@example.com",
      role: "CREATOR",
    },
  ];

  const getContentsTitle = () =>
    screen.getByRole("textbox", {
      name: /Titel/i,
    });

  const getContentsDescription = () =>
    screen.getByRole("textbox", {
      name: /Beschreibung/i,
    });

  const getForwardButton = () => screen.getByRole("button", { name: "Weiter" });

  const invalidClass = "gd-input-invalid";

  test("should have correct form attributes for create Mode", () => {
    const { container } = render(
      <MetadataForm
        categories={[]}
        licenses={[]}
        organizations={organizations}
        {...commonLinks}
      />,
    );
    const form = container.querySelector("form");

    expect(form).toHaveAttribute("id", METADATA_FORM_ID);
    expect(form).toHaveAttribute("action", "/api/metadata/create");
  });

  test("should report validity of inputs and go to next step if all is valid", async () => {
    const user = userEvent.setup();
    render(
      <MetadataForm
        categories={[]}
        licenses={[]}
        organizations={organizations}
        {...commonLinks}
      />,
    );

    const forwardButton = getForwardButton();
    await user.click(forwardButton);

    const contentsTitleInput = getContentsTitle();
    const contentsDescriptionInput = getContentsDescription();

    expect(contentsTitleInput).not.toHaveClass(invalidClass);
    expect(contentsDescriptionInput).not.toHaveClass(invalidClass);

    screen.getByRole("heading", { name: "Angaben zum Inhalt", level: 2 });

    await user.click(forwardButton);

    expect(contentsTitleInput).toHaveClass(invalidClass);
    expect(contentsDescriptionInput).toHaveClass(invalidClass);

    await user.type(contentsTitleInput, "test");
    await user.type(contentsDescriptionInput, "test");
    await user.tab();

    expect(contentsTitleInput).not.toHaveClass(invalidClass);
    expect(contentsDescriptionInput).not.toHaveClass(invalidClass);

    await user.click(forwardButton);

    await screen.findByRole("heading", {
      name: "Kontakte",
      level: 2,
    });
  });

  test("should correctly navigate with the sticky nav", async () => {
    const user = userEvent.setup();
    render(
      <MetadataForm
        categories={[]}
        licenses={[]}
        organizations={organizations}
        {...commonLinks}
      />,
    );

    const nav = screen.getByRole("navigation");
    // getting all items in nav
    const listItems = within(nav).getAllByRole("listitem");

    //first is active
    expect(listItems[0]).toHaveClass("active");

    // clicking the go next button
    await user.click(getForwardButton());

    // nav should recognize this and move forward
    expect(listItems[0]).not.toHaveClass("active");
    expect(listItems[1]).toHaveClass("active");
  });

  test("should set attributes for edit mode", async () => {
    const { container } = render(
      <MetadataForm
        categories={[]}
        licenses={[]}
        organizations={organizations}
        metadata={{ id: "test" } as any}
        {...commonLinks}
      />,
    );

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("id", METADATA_FORM_ID);
    expect(form).toHaveAttribute("action", "/api/metadata/edit");

    const nav = screen.getByRole("navigation");
    // getting all items in first list
    const listItems = within(nav).getAllByRole("listitem");

    // all sticky navs are done and last is active in edit mode
    expect(listItems[0]).toHaveClass("done");
    expect(listItems[1]).toHaveClass("done");
    expect(listItems[2]).toHaveClass("done");
    expect(listItems[3]).toHaveClass("done");
    expect(listItems[4]).toHaveClass("done");
    expect(listItems[5]).toHaveClass("done");
    expect(listItems[6]).toHaveClass("done");
    expect(listItems[7]).toHaveClass("active");

    screen.getByRole("button", { name: "Speichern und schließen" });
  });

  test("should redirect to edit success page after successful request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();

    render(
      <MetadataForm
        categories={[]}
        licenses={[
          { id: "license1", title: "license1", url: "http://example.com" },
        ]}
        organizations={organizations}
        metadata={validMetadata}
        {...commonLinks}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /speichern und schließen/i }),
    );
    expect(mockedRouterPush).toHaveBeenCalledWith(
      PAGES_AUTH.manage_data_form_edit_success,
    );
  });

  test("should show an error after a failed request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 500, ok: false } as any);
    const user = userEvent.setup();

    render(
      <MetadataForm
        categories={[]}
        licenses={[
          { id: "license1", title: "license1", url: "http://example.com" },
        ]}
        organizations={organizations}
        metadata={validMetadata}
        {...commonLinks}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /speichern und schließen/i }),
    );
    const alert = screen.getByRole("alert");
    within(alert).getByText("Es ist ein Fehler aufgetreten", {
      exact: false,
    });
  });

  test("should not send request on enter", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();

    render(
      <MetadataForm
        categories={[]}
        licenses={[
          { id: "license1", title: "license1", url: "http://example.com" },
        ]}
        organizations={organizations}
        metadata={validMetadata}
        {...commonLinks}
      />,
    );

    const input = screen.getByLabelText("Titel", { exact: false });
    const form = input.closest("form");

    const handleSubmit = vi.fn((e) => e.preventDefault());
    form?.addEventListener("submit", handleSubmit);
    await user.type(input, "Testing{enter}");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("should allow Enter key in textarea without preventing default", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();

    render(
      <MetadataForm
        categories={[]}
        licenses={[
          { id: "license1", title: "license1", url: "http://example.com" },
        ]}
        organizations={organizations}
        metadata={validMetadata}
        {...commonLinks}
      />,
    );

    const textareas = screen.getAllByLabelText("Beschreibung");
    const form = textareas[0].closest("form");

    const handleSubmit = vi.fn((e) => e.preventDefault());
    form?.addEventListener("submit", handleSubmit);
    await user.type(textareas[0], "Testing{enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(textareas[0]).toHaveValue("Testing\n");
  });
});
