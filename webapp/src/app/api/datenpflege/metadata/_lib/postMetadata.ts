import { sendAuthorizedRequestWithBasicAuth } from "@/app/api/_lib/sendAuthorizedRequest";
import { convertMetadataFormData } from "@/app/api/datenpflege/metadata/_lib/convertMetadata";
import { HttpMethod } from "@/types/types";

export async function postMetadata(
  username: string,
  request: Request,
  endpoint: string,
  method: HttpMethod,
): Promise<Response | undefined> {
  const formData = await request.formData();
  const data = convertMetadataFormData(formData);

  return sendAuthorizedRequestWithBasicAuth(username, endpoint, method, data);
}
