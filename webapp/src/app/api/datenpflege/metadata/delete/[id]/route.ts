import { getSessionNameOrThrow } from "@/app/api/_lib/getSessionNameOrThrow";
import { sendAuthorizedRequestWithBasicAuth } from "@/app/api/_lib/sendAuthorizedRequest";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<Response | undefined> {
  let username;

  try {
    username = await getSessionNameOrThrow();
  } catch (error) {
    return new Response(null, { status: 401 });
  }

  const endpoint = `${process.env.be_gd_data_url}/metadata/${params.id}`;

  return sendAuthorizedRequestWithBasicAuth(username, endpoint, "DELETE");
}
