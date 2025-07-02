import { getSessionNameOrThrow } from "@/app/api/_lib/getSessionNameOrThrow";
import { postMetadata } from "@/app/api/datenpflege/metadata/_lib/postMetadata";

export async function POST(request: Request) {
  let username;

  try {
    username = await getSessionNameOrThrow();
  } catch (error) {
    return new Response(null, { status: 401 });
  }
  const endpoint = `${process.env.be_gd_data_url}/metadata`;
  return postMetadata(username, request, endpoint, "POST");
}
