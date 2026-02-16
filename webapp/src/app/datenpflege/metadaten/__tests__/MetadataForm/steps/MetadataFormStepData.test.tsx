import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { isFeatureEnabled } from "@/app/_lib/features";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormStepData } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/MetadataFormStepData";
import { OrganizationSorted } from "@/types/types";

vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(),
}));

describe("MetadataFormStepData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
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

  test("should render correct headline", () => {
    render(
      <MetadataFormStepData
        forStep={0}
        currentStep={0}
        organizations={organizations}
      />,
    );
    screen.getByRole("heading", { name: "Datenbereitsteller", level: 2 });
  });

  test("should render correct inputs with name", () => {
    render(
      <MetadataFormStepData
        forStep={0}
        currentStep={0}
        organizations={organizations}
      />,
    );

    const input1 = screen.getByRole("combobox", {
      name: /datenbereitstellende organisation/i,
    });

    expect(input1).toHaveAttribute(
      "name",
      METADATA_FORM_INPUTS.ORGANIZATION_ID,
    );

    const input2 = screen.getByRole("combobox", {
      name: /govdata\-contributorid/i,
    });
    expect(input2).toHaveAttribute("name", METADATA_FORM_INPUTS.CONTRIBUTOR_ID);
  });

  test("should change the contributorIds select options", async () => {
    const { findByDisplayValue, getByDisplayValue } = render(
      <MetadataFormStepData
        forStep={0}
        currentStep={0}
        organizations={organizations}
      />,
    );

    getByDisplayValue("Org 1");
    getByDisplayValue("contrib1");

    const user = userEvent.setup();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: /datenbereitstellende organisation/i,
      }),
      ["org2"],
    );

    expect(await findByDisplayValue("Org 2")).toBeInTheDocument();
    expect(await findByDisplayValue("contrib3")).toBeInTheDocument();
  });

  test("should not render the contributorId select", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);

    render(
      <MetadataFormStepData
        forStep={0}
        currentStep={0}
        organizations={organizations}
      />,
    );

    const input1 = screen.getByRole("combobox", {
      name: /datenbereitstellende organisation/i,
    });

    expect(input1).toHaveAttribute(
      "name",
      METADATA_FORM_INPUTS.ORGANIZATION_ID,
    );

    const input2 = screen.queryByRole("combobox", {
      name: /govdata\-contributorid/i,
    });
    expect(input2).toBeNull();
  });
});
