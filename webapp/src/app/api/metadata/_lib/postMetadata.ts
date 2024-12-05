import { convertMetadataFormData } from "@/app/api/metadata/_lib/convertMetadata";
import { sendAuthorizedRequest } from "@/app/api/_lib/sendAuthorizedRequest";
import { HttpMethod } from "@/types/types";

export async function postMetadata(
  request: Request,
  endpoint: string,
  method: HttpMethod,
): Promise<Response | undefined> {
  const formData = await request.formData();
  const data = convertMetadataFormData(formData);

  return sendAuthorizedRequest(endpoint, method, data);
}
