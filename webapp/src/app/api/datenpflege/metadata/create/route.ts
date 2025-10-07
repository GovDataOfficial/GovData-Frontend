import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { postMetadata } from "@/app/api/datenpflege/metadata/_lib/postMetadata";

export async function POST(request: Request) {
  if (!checkFeatureFlagForDataManagement()) {
    return new Response(null, { status: 501 });
  }

  let username: string;
  try {
    const session = await getSessionOrThrow();
    username = session.username;
  } catch (error) {
    return new Response(null, { status: 401 });
  }
  const endpoint = `${process.env.be_gd_data_url}/metadata`;
  return postMetadata(username, request, endpoint, "POST");
}
