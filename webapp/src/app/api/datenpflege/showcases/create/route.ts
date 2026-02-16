import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

export async function POST(request: Request) {
  if (!checkFeatureFlagForEnvVarDataManagement()) {
    return new Response(null, { status: 501 });
  }

  const endpoint = `${process.env.be_gd_db_url}/showcase`;
  return postShowcase(request, endpoint, "POST");
}
