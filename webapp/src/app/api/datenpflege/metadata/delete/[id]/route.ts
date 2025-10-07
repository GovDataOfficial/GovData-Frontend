import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { sendAuthorizedRequestWithBasicAuth } from "@/app/api/_lib/sendAuthorizedRequest";

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> },
): Promise<Response | undefined> {
  if (!checkFeatureFlagForDataManagement()) {
    return new Response(null, { status: 501 });
  }

  const params = await props.params;
  let username;

  try {
    const session = await getSessionOrThrow();
    username = session.username;
  } catch (error) {
    return new Response(null, { status: 401 });
  }

  const endpoint = `${process.env.be_gd_data_url}/metadata/${params.id}`;

  return sendAuthorizedRequestWithBasicAuth(username, endpoint, "DELETE");
}
