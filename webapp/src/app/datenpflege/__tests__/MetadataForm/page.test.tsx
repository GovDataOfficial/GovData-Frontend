import { beforeAll, describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { redirect } from "next/navigation";

import { fetchOrganizationsForUser } from "@/app/_lib/getData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { METADATA_FORM_ID } from "@/app/datenpflege/_components/MetadataForm/formConstants";
import Page from "@/app/datenpflege/metadaten/erstellen/page";
import { OrganizationSorted } from "@/types/types";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");

vi.mock("@/app/_lib/getData", () => ({
  fetchCategoriesSorted: vi.fn(),
  fetchLicenseActiveSorted: vi.fn(),
  fetchOrganizationsForUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
}));

vi.mock(
  "@/app/datenpflege/_components/MetadataForm/steps/MetadataFormStepData",
  () => ({
    MetadataFormStepData: () => <span></span>,
  }),
);

describe("Metadata create page", () => {
  const mockTokenSet = {
    id_token: "123 ",
    name: "TestNutzer1",
    claims: () => ({ name: "TestNutzer1" }),
  } as any;

  beforeAll(() => {
    vi.mocked(getSessionOrRedirect).mockResolvedValue(mockTokenSet);
  });

  test("should show form", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue([
      {
        id: "org1",
        displayName: "Org 1",
        contributorIds: ["contrib1", "contrib2"],
      },
    ] as OrganizationSorted);
    const { container } = render(await Page());

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("id", METADATA_FORM_ID);
  });

  test("should redirect if user has no organizations", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(undefined);
    render(await Page());
    expect(redirect).toHaveBeenCalledWith(PAGES_AUTH.manage_data);
  });

  test("should redirect if user has no contributorId", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue([
      {
        id: "org1",
        displayName: "Org 1",
        contributorIds: [],
      },
    ] as unknown as OrganizationSorted);
    render(await Page());
    expect(redirect).toHaveBeenCalledWith(PAGES_AUTH.manage_data);
  });
});
