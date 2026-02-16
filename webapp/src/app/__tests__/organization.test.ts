import { beforeEach, describe, expect, it, vi } from "vitest";

import { isFeatureEnabled } from "@/app/_lib/features";
import { fetchOrganizationSorted } from "@/app/_lib/getData";
import {
  getOrganizationDisplayName,
  hasContributorId,
} from "@/app/_lib/organization";
import { Feature } from "@/configuration/featureFlags/types";
import { OrganizationSorted } from "@/types/types";

vi.mock("@/app/_lib/getData");
vi.mock("@/app/_lib/features");

describe("organization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrganizationDisplayName", () => {
    it("should return display name when organization is found", async () => {
      const mockData: OrganizationSorted = [
        { id: "org-1", displayName: "Organization One", contributorIds: [] },
        { id: "org-2", displayName: "Organization Two", contributorIds: [] },
      ] as any;

      vi.mocked(fetchOrganizationSorted).mockResolvedValue(mockData);

      const result = await getOrganizationDisplayName("org-1");

      expect(result).toBe("Organization One");
      expect(fetchOrganizationSorted).toHaveBeenCalledOnce();
    });

    it("should return id when organization is not found", async () => {
      const mockData: OrganizationSorted = [
        { id: "org-1", displayName: "Organization One", contributorIds: [] },
      ] as any;

      vi.mocked(fetchOrganizationSorted).mockResolvedValue(mockData);

      const result = await getOrganizationDisplayName("org-999");

      expect(result).toBe("org-999");
    });

    it("should return id when data is undefined", async () => {
      vi.mocked(fetchOrganizationSorted).mockResolvedValue(undefined);

      const result = await getOrganizationDisplayName("org-1");

      expect(result).toBe("org-1");
    });

    it("should return id when data is an empty array", async () => {
      vi.mocked(fetchOrganizationSorted).mockResolvedValue([]);

      const result = await getOrganizationDisplayName("org-1");

      expect(result).toBe("org-1");
    });
  });

  describe("hasContributorId", () => {
    describe("when contributorIdIsRequired feature is enabled", () => {
      beforeEach(() => {
        vi.mocked(isFeatureEnabled).mockReturnValue(true);
      });

      it("should return true when organization has contributor IDs", () => {
        const organizations: OrganizationSorted = [
          {
            id: "org-1",
            displayName: "Organization One",
            contributorIds: ["contributor-1"],
          } as any,
        ];

        const result = hasContributorId(organizations);

        expect(result).toBe(true);
        expect(isFeatureEnabled).toHaveBeenCalledWith(
          Feature.contributorIdIsRequired,
        );
      });

      it("should return true when at least one organization has contributor IDs", () => {
        const organizations: OrganizationSorted = [
          {
            id: "org-1",
            displayName: "Organization One",
            contributorIds: [],
          },
          {
            id: "org-2",
            displayName: "Organization Two",
            contributorIds: ["contributor-1"],
          },
        ] as any;

        const result = hasContributorId(organizations);

        expect(result).toBe(true);
      });

      it("should return false when organizations have empty contributor IDs", () => {
        const organizations: OrganizationSorted = [
          {
            id: "org-1",
            displayName: "Organization One",
            contributorIds: [],
          },
        ] as any;

        const result = hasContributorId(organizations);

        expect(result).toBe(false);
      });

      it("should return false when organizations have undefined contributor IDs", () => {
        const organizations: OrganizationSorted = [
          {
            id: "org-1",
            displayName: "Organization One",
            contributorIds: undefined,
          },
        ] as any;

        const result = hasContributorId(organizations);

        expect(result).toBe(false);
      });

      it("should return false when organizations is undefined", () => {
        const result = hasContributorId(undefined);

        expect(result).toBe(false);
      });

      it("should return false when organizations is an empty array", () => {
        const result = hasContributorId([]);

        expect(result).toBe(false);
      });
    });

    describe("when contributorIdIsRequired feature is disabled", () => {
      beforeEach(() => {
        vi.mocked(isFeatureEnabled).mockReturnValue(false);
      });

      it("should return true when organizations exist", () => {
        const organizations: OrganizationSorted = [
          {
            id: "org-1",
            displayName: "Organization One",
            contributorIds: ["contributor-1"],
          },
        ] as any;

        const result = hasContributorId(organizations);

        expect(result).toBe(true);
      });

      it("should return true even when contributor IDs are empty", () => {
        const organizations: OrganizationSorted = [
          {
            id: "org-1",
            displayName: "Organization One",
            contributorIds: [],
          },
        ] as any;

        const result = hasContributorId(organizations);

        expect(result).toBe(true);
      });

      it("should return false when organizations is undefined", () => {
        const result = hasContributorId(undefined);

        expect(result).toBe(false);
      });

      it("should return false when organizations is an empty array", () => {
        const result = hasContributorId([]);

        expect(result).toBe(false);
      });
    });
  });
});
