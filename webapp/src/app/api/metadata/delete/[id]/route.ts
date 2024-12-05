import { sendAuthorizedRequest } from "@/app/api/_lib/sendAuthorizedRequest";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<Response | undefined> {
  const endpoint = `${process.env.be_gd_data_url}/metadata/${params.id}`;

  return sendAuthorizedRequest(endpoint, "DELETE");
}
