import { redirect } from "next/navigation";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";

export async function POST(request: Request) {
  return redirect(PAGES_AUTH.manage_data_form_add_success);
}
