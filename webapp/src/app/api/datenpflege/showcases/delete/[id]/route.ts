import { getSessionOrThrow } from "@/app/api/_lib/getSessionNameOrThrow";
import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<Response | undefined> {
  let session;
  try {
    session = await getSessionOrThrow();
  } catch (error) {
    return new Response(null, { status: 401 });
  }

  const endpoint = `${process.env.be_gd_db_url}/showcase/${params.id}`;

  return sendAuthorizedRequestWithBearer(session, endpoint, "DELETE");
}
