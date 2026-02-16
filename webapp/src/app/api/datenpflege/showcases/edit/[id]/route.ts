import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  if (!checkFeatureFlagForEnvVarDataManagement()) {
    return new Response(null, { status: 501 });
  }

  const params = await props.params;
  let session;
  try {
    session = await getSessionOrThrow();
  } catch (error) {
    return new Response(null, { status: 401 });
  }

  const endpoint = `${process.env.be_gd_db_url}/showcase/${params.id}`;
  return postShowcase(session, request, endpoint, "PUT");
}
