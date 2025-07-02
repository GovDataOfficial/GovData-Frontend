import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  SHOWCASE_FORM_INPUTS,
  SHOWCASE_FORM_MAX_LENGTH_SMALL,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormStepLinks } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/links/ShowcaseFormStepLinks";
import { ShowcaseFormLinkType } from "@/types/types";

vi.mock("@/app/_components/SVG/SVG", () => ({
  icons: { trash: "trash", plus: "plus" },
  SVG: ({ icon }: { icon: string }) => <span>{icon}</span>,
}));

describe("ShowcaseFormStepLinks", () => {
  const checkLinkInputMarkup = (
    group: HTMLElement,
    url: string,
    name: string,
    urlInputName: string,
    nameInputName: string,
    urlInputDisplayValue = "",
    nameInputDisplayValue = "",
  ) => {
    const linkUrlInput = within(group).getByRole("textbox", {
      name: urlInputName,
    });
    expect(linkUrlInput).toHaveAttribute("name", url);
    expect(linkUrlInput).not.toBeRequired();
    expect(linkUrlInput).toHaveDisplayValue(urlInputDisplayValue);
    expect(linkUrlInput).toHaveAttribute("type", "url");
    expect(linkUrlInput).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const nameInput = within(group).getByRole("textbox", {
      name: nameInputName,
    });
    expect(nameInput).toHaveAttribute("name", name);
    expect(nameInput).not.toBeRequired();
    expect(nameInput).toHaveDisplayValue(nameInputDisplayValue);
    expect(nameInput).toHaveAttribute("type", "text");
    expect(nameInput).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );
  };

  const linksToShowcasesObject1 = SHOWCASE_FORM_INPUTS.LINK(
    ShowcaseFormLinkType.linksToShowcase,
    "1",
  );

  const usedDatasetsObject1 = SHOWCASE_FORM_INPUTS.LINK(
    ShowcaseFormLinkType.usedDatasets,
    "1",
  );

  const usecaseObject = SHOWCASE_FORM_INPUTS.LINK(ShowcaseFormLinkType.usecase);

  const linkToSourcesObject = SHOWCASE_FORM_INPUTS.LINK(
    ShowcaseFormLinkType.linkToSources,
  );

  const getLinksToShowcasesGroup = () =>
    screen.getByRole("group", {
      name: /Links zur Anwendung/i,
    });
  const getUsedDatasetsGroup = () =>
    screen.getByRole("group", {
      name: /Links zu verwendeten Datensätzen/i,
    });
  const getLinkToSourcesGroup = () =>
    screen.getByRole("group", {
      name: /Link zum Sourcecode/i,
    });
  const getUsecaseGroup = () =>
    screen.getByRole("group", { name: /Link zur Quelle/i });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  test("should render correct headline", () => {
    render(<ShowcaseFormStepLinks />);
    screen.getByRole("heading", { name: "Links", level: 2 });
  });

  test("should render correct input markup", () => {
    render(<ShowcaseFormStepLinks />);
    const groups = [
      {
        getGroup: getLinksToShowcasesGroup,
        object: linksToShowcasesObject1,
        urlName: "URL 1",
        linkName: "Name des Links 1",
      },
      {
        getGroup: getUsedDatasetsGroup,
        object: usedDatasetsObject1,
        urlName: "URL 1",
        linkName: "Name des Links 1",
      },
      {
        getGroup: getLinkToSourcesGroup,
        object: linkToSourcesObject,
        urlName: "URL",
        linkName: "Name des Links",
      },
      {
        getGroup: getUsecaseGroup,
        object: usecaseObject,
        urlName: "URL",
        linkName: "Name des Links",
      },
    ];

    groups.forEach(({ getGroup, object, urlName, linkName }) => {
      const group = getGroup();
      checkLinkInputMarkup(group, object.url, object.name, urlName, linkName);
    });
  });

  test("should render with prefilled inputs", () => {
    const defaultData = {
      defaultLinksToShowcase: [
        { name: "Showcase Link", url: "http://example.com", id: 1 },
      ],
      defaultUsedDatasets: [
        { name: "Dataset Link", url: "http://example.com", id: 1 },
        { name: "Dataset Link 2", url: "http://example.com", id: 2 },
        { name: "Dataset Link 3", url: "http://example.com", id: 3 },
      ],
      defaultLinkToSourcesName: "Source Link",
      defaultLinkToSourcesUrl: "http://example.com",
      defaultUsecasePublisher: "Publisher",
      defaultUsecaseSourceUrl: "http://example.com",
    } satisfies ShowcaseFormStepLinks;

    render(<ShowcaseFormStepLinks {...defaultData} />);
    const groups = [
      {
        getGroup: getLinksToShowcasesGroup,
        object: linksToShowcasesObject1,
        urlName: "URL 1",
        linkName: "Name des Links 1",
        urlDisplayValue: defaultData.defaultLinksToShowcase[0].url,
        nameDisplayValue: defaultData.defaultLinksToShowcase[0].name,
      },
      {
        getGroup: getUsedDatasetsGroup,
        object: usedDatasetsObject1,
        urlName: "URL 1",
        linkName: "Name des Links 1",
        urlDisplayValue: defaultData.defaultUsedDatasets[0].url,
        nameDisplayValue: defaultData.defaultUsedDatasets[0].name,
      },
      {
        getGroup: getUsedDatasetsGroup,
        object: SHOWCASE_FORM_INPUTS.LINK(
          ShowcaseFormLinkType.usedDatasets,
          "2",
        ),
        urlName: "URL 2",
        linkName: "Name des Links 2",
        urlDisplayValue: defaultData.defaultUsedDatasets[1].url,
        nameDisplayValue: defaultData.defaultUsedDatasets[1].name,
      },
      {
        getGroup: getUsedDatasetsGroup,
        object: SHOWCASE_FORM_INPUTS.LINK(
          ShowcaseFormLinkType.usedDatasets,
          "3",
        ),
        urlName: "URL 3",
        linkName: "Name des Links 3",
        urlDisplayValue: defaultData.defaultUsedDatasets[2].url,
        nameDisplayValue: defaultData.defaultUsedDatasets[2].name,
      },
      {
        getGroup: getLinkToSourcesGroup,
        object: linkToSourcesObject,
        urlName: "URL",
        linkName: "Name des Links",
        urlDisplayValue: defaultData.defaultLinkToSourcesUrl,
        nameDisplayValue: defaultData.defaultLinkToSourcesName,
      },
      {
        getGroup: getUsecaseGroup,
        object: usecaseObject,
        urlName: "URL",
        linkName: "Name des Links",
        urlDisplayValue: defaultData.defaultUsecaseSourceUrl,
        nameDisplayValue: defaultData.defaultUsecasePublisher,
      },
    ];

    groups.forEach(
      ({
        getGroup,
        object,
        urlName,
        linkName,
        urlDisplayValue,
        nameDisplayValue,
      }) => {
        const group = getGroup();
        checkLinkInputMarkup(
          group,
          object.url,
          object.name,
          urlName,
          linkName,
          urlDisplayValue,
          nameDisplayValue,
        );
      },
    );
  });

  test("should add a new link", async () => {
    const inputNameObject = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.linksToShowcase,
      "3",
    );
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const addButton = within(linksToShowcasesGroup).getByRole("button", {
      name: /link hinzufügen/i,
    });

    await user.click(addButton);

    checkLinkInputMarkup(
      linksToShowcasesGroup,
      inputNameObject.url,
      inputNameObject.name,
      "URL 3",
      "Name des Links 3",
    );
  });

  test("should delete a link", async () => {
    const inputNameObject = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.linksToShowcase,
      "1",
    );
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const deleteLink1Button = within(linksToShowcasesGroup).getByRole(
      "button",
      {
        name: /link 1 löschen/i,
      },
    );

    await user.click(deleteLink1Button);

    checkLinkInputMarkup(
      linksToShowcasesGroup,
      inputNameObject.url,
      inputNameObject.name,
      "URL 1",
      "Name des Links 1",
    );

    const linkUrlInput = within(linksToShowcasesGroup).queryByRole("textbox", {
      name: "URL 2",
    });
    expect(linkUrlInput).not.toBeInTheDocument();
  });

  test("does not delete if not confirmed", async () => {
    const inputNameObject = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.linksToShowcase,
      "2",
    );
    vi.spyOn(window, "confirm").mockImplementation(() => false);
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const deleteLink1Button = within(linksToShowcasesGroup).getByRole(
      "button",
      {
        name: /link 1 löschen/i,
      },
    );

    await user.click(deleteLink1Button);

    checkLinkInputMarkup(
      linksToShowcasesGroup,
      inputNameObject.url,
      inputNameObject.name,
      "URL 2",
      "Name des Links 2",
    );
  });

  test("should not offer an add button", async () => {
    render(<ShowcaseFormStepLinks />);

    const usecaseGroup = getUsecaseGroup();
    expect(
      within(usecaseGroup).queryByRole("button", { name: /link hinzufügen/i }),
    ).not.toBeInTheDocument();

    const linkToSourcesGroup = getLinkToSourcesGroup();
    expect(
      within(linkToSourcesGroup).queryByRole("button", {
        name: /link hinzufügen/i,
      }),
    ).not.toBeInTheDocument();
  });

  test("should show live region message after delete", async () => {
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const deleteLink1Button = within(linksToShowcasesGroup).getByRole(
      "button",
      {
        name: /link 1 löschen/i,
      },
    );

    await user.click(deleteLink1Button);

    const srOnlyText = screen.getByText("Link 1 gelöscht");
    expect(srOnlyText).toHaveClass("sr-only");
  });

  test("should show live region message after add", async () => {
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const addButton = within(linksToShowcasesGroup).getByRole("button", {
      name: /link hinzufügen/i,
    });

    await user.click(addButton);

    const srOnlyText = screen.getByText("Link hinzugefügt");
    expect(srOnlyText).toHaveClass("sr-only");
  });

  test("should focus add button after delete", async () => {
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const deleteLink1Button = within(linksToShowcasesGroup).getByRole(
      "button",
      {
        name: /link 1 löschen/i,
      },
    );

    await user.click(deleteLink1Button);

    const addButton = within(linksToShowcasesGroup).getByRole("button", {
      name: /link hinzufügen/i,
    });
    expect(addButton).toHaveFocus();
  });

  test("should focus first input of the new resource after add", async () => {
    const user = userEvent.setup();
    render(<ShowcaseFormStepLinks />);

    const linksToShowcasesGroup = getLinksToShowcasesGroup();
    const addButton = within(linksToShowcasesGroup).getByRole("button", {
      name: /link hinzufügen/i,
    });

    await user.click(addButton);

    const firstInput = within(linksToShowcasesGroup).getByRole("textbox", {
      name: /name des links 3/i,
    });
    expect(firstInput).toHaveFocus();
  });
});
