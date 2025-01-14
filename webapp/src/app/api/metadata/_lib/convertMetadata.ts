import { METADATA_FORM_INPUTS } from "@/app/datenpflege/_components/MetadataForm/formConstants";
import { MetadataContactRole } from "@/types/types";

const extractContactDataByType = (
  formData: FormData,
  type: MetadataContactRole,
) => {
  const contact = METADATA_FORM_INPUTS.CONTACTS(type);
  return {
    name: formData.get(contact.name),
    email: formData.get(contact.email),
    url: formData.get(contact.url),
    address: {
      addressee: formData.get(contact.address.addressee),
      details: formData.get(contact.address.details),
      street: formData.get(contact.address.street),
      city: formData.get(contact.address.city),
      zip: formData.get(contact.address.zip),
      country: formData.get(contact.address.country),
    },
  };
};

const extractContacts = (formData: FormData) => {
  const contacts: any = {};
  Object.values(MetadataContactRole).forEach((role) => {
    contacts[role.toLowerCase()] = extractContactDataByType(formData, role);
  });
  return contacts;
};

const extractResources = (formData: FormData) => {
  const resources = [];
  let i = 0;
  while (formData.has(METADATA_FORM_INPUTS.RESSOURCE(i).url)) {
    const resourcesObject = METADATA_FORM_INPUTS.RESSOURCE(i) as {
      [key: string]: string;
    };
    const resource: Record<string, any> = {};
    Object.keys(resourcesObject).forEach((key) => {
      resource[key] = formData.get(resourcesObject[key]);
    });
    resource.hvd = !!resource.hvd;
    resources.push(resource);
    i++;
  }
  return resources;
};

export function convertMetadataFormData(
  formData: FormData,
): Record<string, any> {
  let result: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (
      !key.includes("contacts") &&
      !key.includes("resources") &&
      !key.includes(METADATA_FORM_INPUTS.CATEGORIES) &&
      !key.includes(METADATA_FORM_INPUTS.HVD_CATEGORIES)
    ) {
      result[key] = value.toString();
    }
  });

  result[METADATA_FORM_INPUTS.CATEGORIES] = formData.getAll(
    METADATA_FORM_INPUTS.CATEGORIES,
  );
  result[METADATA_FORM_INPUTS.HVD_CATEGORIES] = formData.getAll(
    METADATA_FORM_INPUTS.HVD_CATEGORIES,
  );
  result["resources"] = extractResources(formData);
  result["contacts"] = extractContacts(formData);

  return result;
}
