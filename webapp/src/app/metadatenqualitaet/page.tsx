import { notFound, redirect } from "next/navigation";

export default async function Page() {
  if (process.env.metadata_quality_dashboard_active !== "1") {
    notFound();
  }

  redirect("/metadatenqualitaet/qualitaetsmerkmale");
}
