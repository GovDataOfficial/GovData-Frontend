import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";
import { SessionInformation } from "@/app/api/auth/_session";
import { convertShowcaseFormData } from "@/app/api/datenpflege/showcases/_lib/convertShowcase";
import { HttpMethod } from "@/types/types";

export async function postShowcase(
  session: SessionInformation,
  request: Request,
  endpoint: string,
  method: HttpMethod,
): Promise<Response | undefined> {
  const formData = await request.formData();
  const data = convertShowcaseFormData(formData);

  return sendAuthorizedRequestWithBearer(session, endpoint, method, data);
}
