import { beforeAll, describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { redirect } from "next/navigation";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  getSessionOrRedirect,
  getUserInformation,
} from "@/app/api/auth/_session";
import { SHOWCASE_FORM_ID } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import Page from "@/app/datenpflege/anwendungen/erstellen/page";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");

vi.mock("@/app/_lib/getData", () => ({
  fetchCategoriesSorted: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
}));

vi.mock(
  "@/app/datenpflege/_components/ShowcaseForm/steps/ShowcaseFormStepContents",
  () => ({
    ShowcaseFormStepContents: () => <span></span>,
  }),
);

vi.mock(
  "@/app/datenpflege/_components/ShowcaseForm/steps/ShowcaseFormStepLinks",
  () => ({
    ShowcaseFormStepLinks: () => <span></span>,
  }),
);

vi.mock(
  "@/app/datenpflege/_components/ShowcaseForm/steps/ShowcaseFormStepContact",
  () => ({
    ShowcaseFormStepContact: () => <span></span>,
  }),
);

vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation",
  () => ({
    useShowcaseFormStickyNavigation: vi.fn().mockReturnValue({
      isActive: () => false,
    }),
  }),
);
vi.mocked(getUserInformation).mockResolvedValue({
  username: "test",
  isShowcaseEditor: true,
});

describe("Showcase create page", () => {
  const mockTokenSet = {
    id_token: "123 ",
    name: "TestNutzer1",
    claims: () => ({ name: "TestNutzer1" }),
  } as any;

  beforeAll(() => {
    vi.mocked(getSessionOrRedirect).mockResolvedValue(mockTokenSet);
  });

  test("should show form", async () => {
    const { container } = render(await Page());
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("id", SHOWCASE_FORM_ID);
  });

  test("should redirect if user has no organizations", async () => {
    vi.mocked(getUserInformation).mockResolvedValue({
      username: "test",
      isShowcaseEditor: false,
    });
    render(await Page());
    expect(redirect).toHaveBeenCalledWith(PAGES_AUTH.manage_showcases);
  });
});
