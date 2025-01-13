import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

import { fetchMetadata, fetchOrganizationsForUser } from "@/app/_lib/getData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { MetadataForm } from "@/app/datenpflege/_components/MetaDataForm/MetadataForm";
import Page from "@/app/datenpflege/metadaten/bearbeiten/[id]/page";

import { metadata } from "../metadaten/bearbeiten/[id]/page";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/_lib/getData");
vi.mock("next/navigation");
vi.mock("@/app/datenpflege/_components/MetaDataForm/MetadataForm");

describe("Metadata Edit Page", () => {
  const orgsWithoutContributorId = [
    {
      id: "123",
      contributorIds: [],
      title: "Org 1",
      displayName: "Org 1",
      name: "Org 1",
    },
    {
      id: "124",
      contributorIds: [],
      title: "Org 2",
      displayName: "Org 2",
      name: "Org 2",
    },
  ];

  const orgsWithContributorId = [
    {
      id: "myOrgId",
      contributorIds: ["123"],
      title: "Org 1",
      displayName: "Org 1",
      name: "Org 1",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    const mockSession = {
      username: "test",
      id_token: "123",
      refresh_token: "123",
      iat: 0,
    };
    vi.mocked(getSessionOrRedirect).mockResolvedValue(mockSession);

    vi.mocked(MetadataForm).mockReturnValue(
      <div data-testid="mock-metadataform" />,
    );
  });

  test("should export correct metadata", () => {
    expect(metadata.title).toBe("Metadatensatz bearbeiten - GovData");
  });

  test("should redirect if no no contributor-ids are available", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(
      orgsWithoutContributorId,
    );
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);
    expect(vi.mocked(redirect)).toHaveBeenCalledWith(PAGES_AUTH.manage_data);
  });

  test("should redirect if no no org is available", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue([]);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);
    expect(vi.mocked(redirect)).toHaveBeenCalledWith(PAGES_AUTH.manage_data);
  });

  test("should render error if requested metadata has not the same org as user", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(
      orgsWithContributorId,
    );
    vi.mocked(fetchMetadata).mockResolvedValue({ owner_org: "no" } as any);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);
    expect(vi.mocked(redirect)).not.toHaveBeenCalled();

    const alertMessage = screen.getByRole("alert");
    expect(alertMessage).toHaveTextContent(
      "Die Daten konnten nicht geladen werden oder Sie sind nicht berechtigt, die Daten zu bearbeiten.",
    );
  });

  test("should render MetaDataForm", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(
      orgsWithContributorId,
    );
    vi.mocked(fetchMetadata).mockResolvedValue({ owner_org: "myOrgId" } as any);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);

    expect(vi.mocked(redirect)).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    expect(screen.getByTestId("mock-metadataform")).toBeInTheDocument();
  });
});
