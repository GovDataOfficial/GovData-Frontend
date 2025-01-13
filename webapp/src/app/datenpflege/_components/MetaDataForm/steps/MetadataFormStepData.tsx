import { useEffect, useState } from "react";

import { Select } from "@/app/_components/Inputs/Select";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { i18n } from "@/i18n";
import { OrganizationSorted } from "@/types/types";

type MetadataFormStepData = Omit<MetaDataFormStepContainer, "headline"> & {
  organizations: OrganizationSorted;
  defaultOrgId?: string;
  defaultContributerId?: string[];
};

export function MetadataFormStepData({
  currentStep,
  forStep,
  organizations,
  defaultOrgId,
  defaultContributerId,
}: MetadataFormStepData) {
  const initialOrgId = defaultOrgId || organizations[0].id;
  const initialContributerId = defaultContributerId
    ? defaultContributerId[0]
    : organizations[0].contributorIds[0];

  const [selectedOrgId, setSelectedOrgId] = useState<string>(initialOrgId);
  const [selectedContributorId, setSelectedContributorId] =
    useState<string>(initialContributerId);

  const handleOrgChange = (newOrgId: string) => {
    setSelectedOrgId(newOrgId);

    const selectedOrg = organizations.find((org) => org.id === newOrgId);
    if (selectedOrg && selectedOrg.contributorIds.length > 0) {
      setSelectedContributorId(selectedOrg.contributorIds[0]);
    }
  };

  const selectedOrg = organizations.find((org) => org.id === selectedOrgId);

  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.data")}
    >
      <Select
        label={i18n.t("metadataform.field.organizationId.label")}
        name={METADATA_FORM_INPUTS.ORGANIZATION_ID}
        value={selectedOrgId}
        onChange={handleOrgChange}
        required
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.displayName}
          </option>
        ))}
      </Select>

      <Select
        label={i18n.t("metadataform.field.contributorId.label")}
        name={METADATA_FORM_INPUTS.CONTRIBUTOR_ID}
        value={selectedContributorId}
        required
      >
        {selectedOrg?.contributorIds.map((contributorId) => (
          <option key={contributorId} value={contributorId}>
            {contributorId}
          </option>
        ))}
      </Select>
    </MetaDataFormStepContainer>
  );
}
