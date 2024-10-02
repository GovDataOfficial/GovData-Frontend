import { Metadata } from "next";
import { i18n } from "@/i18n";
import { SectionSchnittstellen } from "@/app/sparql-assistent/_components/SectionSchnittstellen";
import { SectionSparqlAssistent } from "@/app/sparql-assistent/_components/SectionSparqlAssistent";
import { SectionSparqlEditor } from "@/app/sparql-assistent/_components/SectionSparqlEditor";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

export const metadata: Metadata = metaDataGenerator({
  title: i18n.t("meta.sparql.title"),
});
export default function Page() {
  return (
    <>
      <h1 className="sr-only">{i18n.t("sparql.assistent.headline")}</h1>
      <SectionSchnittstellen />
      <SectionSparqlAssistent />
      <SectionSparqlEditor
        endpoints={{
          ds: process.env.GD_SPARQL_DS as string,
          mqa: process.env.GD_SPARQL_MQA as string,
        }}
      />
    </>
  );
}
