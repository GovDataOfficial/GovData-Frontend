import { getSessionOrThrow } from "@/app/api/_lib/getSessionNameOrThrow";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

export async function POST(request: Request) {
  let session;
  try {
    session = await getSessionOrThrow();
  } catch (error) {
    return new Response(null, { status: 401 });
  }

  const endpoint = `${process.env.be_gd_db_url}/showcase`;
  return postShowcase(session, request, endpoint, "POST");
}
