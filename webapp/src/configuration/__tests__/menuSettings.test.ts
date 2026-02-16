import { beforeEach, describe, expect, it, vi } from "vitest";

import { isFeatureEnabled } from "@/app/_lib/features";
import { Feature } from "@/configuration/featureFlags/types";

// Mock the features module
vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(),
}));

describe("menuSettings", () => {
  const mockIsFeatureEnabled = vi.mocked(isFeatureEnabled);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  describe("when showSparql feature is enabled", () => {
    beforeEach(() => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature === Feature.showSparql,
      );
    });

    it("should include sparql menu item when metadata quality dashboard is disabled", async () => {
      vi.stubEnv("metadata_quality_dashboard_active", "0");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      expect(menuSettings).toHaveLength(3);
      expect(menuSettings[0].href).toBe("/daten");
      expect(menuSettings[1].href).toBe("/sparql-assistent");
      expect(menuSettings[2].href).toBe("/informationen");
    });

    it("should include both metadata quality and sparql menu items when metadata quality dashboard is enabled", async () => {
      vi.stubEnv("metadata_quality_dashboard_active", "1");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      expect(menuSettings).toHaveLength(4);
      expect(menuSettings[0].href).toBe("/daten");
      expect(menuSettings[1].href).toBe("/metadatenqualitaet");
      expect(menuSettings[2].href).toBe("/sparql-assistent");
      expect(menuSettings[3].href).toBe("/informationen");
    });

    it("should include sparql menu item when metadata quality dashboard env var is not set", async () => {
      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      expect(menuSettings).toHaveLength(3);
      expect(menuSettings[0].href).toBe("/daten");
      expect(menuSettings[1].href).toBe("/sparql-assistent");
      expect(menuSettings[2].href).toBe("/informationen");
    });
  });

  describe("when showSparql feature is disabled", () => {
    beforeEach(() => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature !== Feature.showSparql,
      );
    });

    it("should not include sparql menu item when metadata quality dashboard is disabled", async () => {
      vi.stubEnv("metadata_quality_dashboard_active", "0");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      expect(menuSettings).toHaveLength(2);
      expect(menuSettings[0].href).toBe("/daten");
      expect(menuSettings[1].href).toBe("/informationen");

      // Verify sparql item is not present
      const sparqlItem = menuSettings.find(
        (item) => item.href === "/sparql-assistent",
      );
      expect(sparqlItem).toBeUndefined();
    });

    it("should include metadata quality but not sparql menu item when metadata quality dashboard is enabled", async () => {
      vi.stubEnv("metadata_quality_dashboard_active", "1");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      expect(menuSettings).toHaveLength(3);
      expect(menuSettings[0].href).toBe("/daten");
      expect(menuSettings[1].href).toBe("/metadatenqualitaet");
      expect(menuSettings[2].href).toBe("/informationen");

      // Verify sparql item is not present
      const sparqlItem = menuSettings.find(
        (item) => item.href === "/sparql-assistent",
      );
      expect(sparqlItem).toBeUndefined();
    });

    it("should not include sparql menu item when metadata quality dashboard env var is not set", async () => {
      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      expect(menuSettings).toHaveLength(2);
      expect(menuSettings[0].href).toBe("/daten");
      expect(menuSettings[1].href).toBe("/informationen");

      // Verify sparql item is not present
      const sparqlItem = menuSettings.find(
        (item) => item.href === "/sparql-assistent",
      );
      expect(sparqlItem).toBeUndefined();
    });
  });

  describe("menu item properties", () => {
    beforeEach(() => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature === Feature.showSparql,
      );
      vi.stubEnv("metadata_quality_dashboard_active", "1");
    });

    it("should have correct properties for data menu item", async () => {
      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const dataItem = menuSettings.find((item) => item.href === "/daten");
      expect(dataItem).toEqual({
        href: "/daten",
        name: "Daten",
        color: "data-green",
      });
    });

    it("should have correct properties for sparql menu item", async () => {
      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const sparqlItem = menuSettings.find(
        (item) => item.href === "/sparql-assistent",
      );
      expect(sparqlItem).toEqual({
        href: "/sparql-assistent",
        name: "SPARQL",
        color: "devcorner-green",
      });
    });

    it("should have correct properties for information menu item", async () => {
      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const infoItem = menuSettings.find(
        (item) => item.href === "/informationen",
      );
      expect(infoItem).toEqual({
        href: "/informationen",
        name: "Informationen",
        color: "black",
      });
    });

    it("should have correct properties for metadata quality menu item", async () => {
      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const metadataItem = menuSettings.find(
        (item) => item.href === "/metadatenqualitaet",
      );
      expect(metadataItem).toEqual({
        href: "/metadatenqualitaet",
        name: "Metadatenqualität",
        color: "magenta",
        subMenu: [
          {
            href: "/metadatenqualitaet/qualitaetsmerkmale",
            name: "Qualitätsmerkmale",
            color: "magenta",
          },
          {
            href: "/metadatenqualitaet/top5",
            name: "TOP 5",
            color: "magenta",
          },
        ],
      });
    });
  });

  describe("menu order", () => {
    it("should maintain correct menu order when both features are enabled", async () => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature === Feature.showSparql,
      );
      vi.stubEnv("metadata_quality_dashboard_active", "1");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const menuOrder = menuSettings.map((item) => item.href);
      expect(menuOrder).toEqual([
        "/daten",
        "/metadatenqualitaet",
        "/sparql-assistent",
        "/informationen",
      ]);
    });

    it("should maintain correct menu order when only sparql is enabled", async () => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature === Feature.showSparql,
      );
      vi.stubEnv("metadata_quality_dashboard_active", "0");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const menuOrder = menuSettings.map((item) => item.href);
      expect(menuOrder).toEqual([
        "/daten",
        "/sparql-assistent",
        "/informationen",
      ]);
    });

    it("should maintain correct menu order when only metadata quality is enabled", async () => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature !== Feature.showSparql,
      );
      vi.stubEnv("metadata_quality_dashboard_active", "1");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const menuOrder = menuSettings.map((item) => item.href);
      expect(menuOrder).toEqual([
        "/daten",
        "/metadatenqualitaet",
        "/informationen",
      ]);
    });

    it("should maintain correct menu order when both features are disabled", async () => {
      mockIsFeatureEnabled.mockImplementation(
        (feature: Feature) => feature !== Feature.showSparql,
      );
      vi.stubEnv("metadata_quality_dashboard_active", "0");

      vi.resetModules();
      const { menuSettings } = await import("../menuSettings");

      const menuOrder = menuSettings.map((item) => item.href);
      expect(menuOrder).toEqual(["/daten", "/informationen"]);
    });
  });

  describe("metaDataQualityMenu", () => {
    it("should export metaDataQualityMenu with correct structure", async () => {
      vi.resetModules();
      const { metaDataQualityMenu } = await import("../menuSettings");

      expect(metaDataQualityMenu).toEqual([
        {
          link: "/metadatenqualitaet/qualitaetsmerkmale",
          title: "Qualitätsmerkmale",
        },
        {
          link: "/metadatenqualitaet/top5",
          title: "Top 5",
        },
      ]);
    });
  });
});
