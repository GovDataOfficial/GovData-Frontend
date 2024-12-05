import { postMetadata } from "@/app/api/metadata/_lib/postMetadata";

export async function POST(request: Request) {
  const endpoint = `${process.env.be_gd_data_url}/metadata`;
  return postMetadata(request, endpoint, "POST");
}
