import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { defaultShowcaseTypeData } from "@/app/_lib/defaultFormData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import {
  SHOWCASE_FORM_ID,
  SHOWCASE_FORM_INPUTS,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import { useShowcaseFormStickyNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation";

describe("ShowcaseForm", () => {
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

  vi.mock(
    "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation",
    () => ({
      useShowcaseFormStickyNavigation: vi.fn(),
    }),
  );

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
    vi.mocked(useShowcaseFormStickyNavigation).mockReturnValue({
      isActive: () => false,
    });
  });

  const validShowcaseData = {} as any;
  validShowcaseData[SHOWCASE_FORM_INPUTS.ID] = "test";
  validShowcaseData[SHOWCASE_FORM_INPUTS.TITLE] = "testtitle";
  validShowcaseData[SHOWCASE_FORM_INPUTS.NOTES] = "a note";
  validShowcaseData[SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES] = ["website"];

  const getContentsTitle = () =>
    screen.getByRole("textbox", {
      name: /Titel/i,
    });

  const getContentsNotes = () =>
    screen.getByRole("textbox", {
      name: /Beschreibung/i,
    });

  const getShowcaseTypesGroup = () =>
    screen.getByRole("group", { name: "Anwendungstypen" });

  const getPublishButton = () =>
    screen.getByRole("button", { name: "Anwendung veröffentlichen" });
  const getSaveButton = () =>
    screen.getByRole("button", { name: "Speichern und schließen" });

  test("should have correct form attributes for create mode", () => {
    const { container } = render(<ShowcaseForm categories={[]} />);
    const form = container.querySelector("form");

    expect(form).toHaveAttribute("id", SHOWCASE_FORM_ID);
    expect(form).toHaveAttribute("action", API_ENDPOINTS.SHOWCASES.CREATE);
  });

  test("should report validity of inputs", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();
    render(<ShowcaseForm categories={[]} />);

    const publishButton = getPublishButton();
    await user.click(publishButton);

    const contentsTitleInput = getContentsTitle() as HTMLInputElement;
    const contentsNotesInput = getContentsNotes() as HTMLInputElement;
    const showcaseTypesGroup = getShowcaseTypesGroup();
    const checkbox = within(showcaseTypesGroup).getByLabelText(
      defaultShowcaseTypeData[0].label,
    ) as HTMLInputElement;
    expect(checkbox).not.toBeChecked();
    expect(checkbox.checkValidity()).toEqual(false);

    expect(contentsTitleInput.checkValidity()).toEqual(false);
    expect(contentsNotesInput.checkValidity()).toEqual(false);

    await user.type(contentsTitleInput, "test");
    await user.type(contentsNotesInput, "test");
    await user.tab();
    await user.click(checkbox);

    expect(contentsTitleInput.checkValidity()).toEqual(true);
    expect(contentsNotesInput.checkValidity()).toEqual(true);
    expect(checkbox).toBeChecked();
    expect(checkbox.checkValidity()).toEqual(true);

    await user.click(publishButton);
    expect(mockedRouterPush).toHaveBeenCalledWith(
      PAGES_AUTH.manage_showcases_form_add_success,
    );
  });

  test("should set attributes for edit mode", async () => {
    const { container } = render(
      <ShowcaseForm categories={[]} showcaseData={validShowcaseData} />,
    );

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("id", SHOWCASE_FORM_ID);
    expect(form).toHaveAttribute(
      "action",
      `${API_ENDPOINTS.SHOWCASES.EDIT}/test`,
    );
    getSaveButton();
  });

  test("should redirect to edit success page after successful request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();

    render(<ShowcaseForm categories={[]} showcaseData={validShowcaseData} />);

    await user.click(getSaveButton());
    expect(mockedRouterPush).toHaveBeenCalledWith(
      PAGES_AUTH.manage_showcases_form_edit_success,
    );
  });

  test("should show an error after a failed request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 500, ok: false } as any);
    const user = userEvent.setup();

    render(<ShowcaseForm categories={[]} showcaseData={validShowcaseData} />);

    await user.click(getSaveButton());
    const alert = screen.getByRole("alert");
    within(alert).getByText("Es ist ein Fehler aufgetreten", {
      exact: false,
    });
  });

  test("should not send request on enter", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();

    render(<ShowcaseForm categories={[]} showcaseData={validShowcaseData} />);

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

    render(<ShowcaseForm categories={[]} />);

    const notes = getContentsNotes();
    const form = notes.closest("form");

    const handleSubmit = vi.fn((e) => e.preventDefault());
    form?.addEventListener("submit", handleSubmit);
    await user.type(notes, "Testing{enter}");

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(notes).toHaveValue("Testing\n");
  });
});
