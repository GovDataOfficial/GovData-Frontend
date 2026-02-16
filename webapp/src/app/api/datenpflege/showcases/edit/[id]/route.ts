import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  if (!checkFeatureFlagForEnvVarDataManagement()) {
    return new Response(null, { status: 501 });
  }

  const params = await props.params;
  const endpoint = `${process.env.be_gd_db_url}/showcase/${params.id}`;
  return postShowcase(request, endpoint, "PUT");
}
