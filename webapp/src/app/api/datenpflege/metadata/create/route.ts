import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { postMetadata } from "@/app/api/datenpflege/metadata/_lib/postMetadata";

export async function POST(request: Request) {
  if (!checkFeatureFlagForEnvVarDataManagement()) {
    return new Response(null, { status: 501 });
  }

  const endpoint = `${process.env.be_gd_data_url}/metadata`;
  return postMetadata(request, endpoint, "POST");
}
