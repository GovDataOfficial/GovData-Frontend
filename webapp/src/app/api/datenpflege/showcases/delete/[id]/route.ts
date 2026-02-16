import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> },
): Promise<Response | undefined> {
  if (!checkFeatureFlagForEnvVarDataManagement()) {
    return new Response(null, { status: 501 });
  }

  const params = await props.params;
  const endpoint = `${process.env.be_gd_db_url}/showcase/${params.id}`;
  return sendAuthorizedRequestWithBearer(endpoint, "DELETE");
}
