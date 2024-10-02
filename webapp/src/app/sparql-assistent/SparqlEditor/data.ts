import { EndpointTypeOption } from "@/app/sparql-assistent/SparqlEditor/types";

export const formatOptions = [
  { key: "application/sparql-results+json,*/*;q=0.9", label: "JSON" },
  { key: "application/sparql-results+xml,*/*;q=0.9", label: "XML" },
  { key: "text/csv,*/*;q=0.9", label: "CSV" },
];

export const endpointOptions = [
  { key: "ds", label: "Metadaten" },
  { key: "mqa", label: "Validierungsdaten" },
] as EndpointTypeOption[];

export const PREFIXES = {
  ADMS: {
    key: "adms",
    scheme: "http://www.w3.org/ns/adms#",
  },
  DCAT: {
    key: "dcat",
    scheme: "http://www.w3.org/ns/dcat#",
  },
  DCATDE: {
    key: "dcatde",
    scheme: "http://dcat-ap.de/def/dcatde/",
  },
  DCT: {
    key: "dct",
    scheme: "http://purl.org/dc/terms/",
  },
  DQV: {
    key: "dqv",
    scheme: "http://www.w3.org/ns/dqv#",
  },
  FOAF: {
    key: "foaf",
    scheme: "http://xmlns.com/foaf/0.1/",
  },
  GEO: {
    key: "geo",
    scheme: "http://www.w3.org/2003/01/ge",
  },
  GEOF: {
    key: "geof",
    scheme: "http://www.opengis.net/def/function/geosparql/",
  },
  MQA: {
    key: "mqa",
    scheme: "http://govdata.de/mqa/#",
  },
  RDF: {
    key: "rdf",
    scheme: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  },
  SHACLE: {
    key: "shacl",
    scheme: "http://www.w3.org/ns/shacl#",
  },
  UOM: {
    key: "uom",
    scheme: "http://www.opengis.net/def/uom/OGC/1.0/",
  },
  XSD: {
    key: "xsd",
    scheme: "http://www.w3.org/2001/XMLSchema#",
  },
};

export const QUERIES = {
  ds: [
    {
      name: "Anzahl der Datensätze insgesamt",
      query:
        "SELECT (COUNT(?dataset) AS ?datasets) WHERE {\n" +
        "  ?dataset a dcat:Dataset .\n" +
        "}",
      prefixes: [PREFIXES.DCAT],
    },
    {
      name: "Durchschnittliche Anzahl Distributionen pro Datensatz",
      query:
        "SELECT ?datasets ?distributions (?distributions / ?datasets AS ?averageDistributionsPerDataset) WHERE {\n" +
        "  {\n" +
        "  SELECT (COUNT(?dataset) AS ?datasets) (SUM(?distributionsPerDataset) AS ?distributions) WHERE {\n" +
        "      {\n" +
        "      SELECT ?dataset (COUNT(?distribution) AS ?distributionsPerDataset) WHERE {\n" +
        "        ?dataset a dcat:Dataset .\n" +
        "        ?dataset dcat:distribution ?distribution .\n" +
        "        } GROUP BY ?dataset\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "LIMIT 100",
      prefixes: [PREFIXES.DCAT],
    },
    {
      name: "Schlagwörter oder Kategorien der letzten 30 Tage, sortiert nach Aufkommen",
      query:
        "SELECT DISTINCT ?keyword (COUNT(?keyword) AS ?count) WHERE {\n" +
        "  SELECT ?keyword WHERE {\n" +
        "      ?dataset a dcat:Dataset .\n" +
        "      ?dataset dct:modified ?modified .\n" +
        "      BIND(DATATYPE(?modified) AS ?modifiedType) .\n" +
        "      FILTER(?modifiedType IN (xsd:dateTime, xsd:date)) .\n" +
        "      BIND(NOW() as ?nowDateTime) .\n" +
        "      BIND(xsd:date(?nowDateTime) AS ?nowDate) .\n" +
        '      BIND("P30DT0H0M0.000S"^^xsd:duration AS ?timespan) .\n' +
        "      BIND((?nowDateTime - ?timespan) AS ?earliestDateTime) .\n" +
        "      BIND((?nowDate - ?timespan) AS ?earliestDate) .\n" +
        "      BIND(IF(?modifiedType = xsd:dateTime, ?modified > ?earliestDateTime, ?modified > ?earliestDate) AS ?isWithinTimespan) .\n" +
        "      FILTER(?isWithinTimespan = true) .\n" +
        "      ?dataset dcat:keyword ?keyword .\n" +
        "  }\n" +
        "} GROUP BY ?keyword\n" +
        "  ORDER BY DESC(?count)\n" +
        "LIMIT 100",
      prefixes: [PREFIXES.DCAT, PREFIXES.DCT, PREFIXES.XSD],
    },
    {
      name: "Anzahl geteilter Kategorien und Schlagwörter mit anderen Datensätzen",
      query:
        "SELECT ?dataset (COUNT(DISTINCT ?theme) AS ?sharedThemes) (COUNT(DISTINCT ?keyword) AS ?sharedKeywords) WHERE {\n" +
        "    # hier wird ein Beispieldatensatz verwendet, der sich für die Untersuchung anderer Datensätze beliebig austauschen lässt\n" +
        '    # "Geologische Übersichtskarte der Bundesrepublik Deutschland 1:200.000 (GÜK200) - CC 8742 Bad Reichenhall"\n' +
        "    BIND(<https://gdk.gdi-de.org/inspire/srv/eng/xml_iso19139?uuid=03158696-2C79-48E3-9C61-D205DFA94690> AS ?fixedDataset) .\n" +
        "    ?fixedDataset dcat:theme ?theme .\n" +
        "    ?fixedDataset dcat:keyword ?keyword .\n" +
        "    FILTER(STR(?keyword) != 'opendata') .\n" +
        "    ?dataset a dcat:Dataset .\n" +
        "    FILTER(?fixedDataset != ?dataset) .\n" +
        "    ?dataset dcat:keyword ?keyword .\n" +
        "    ?dataset dcat:theme ?theme .\n" +
        "} GROUP BY ?dataset\n" +
        "LIMIT 100",
      prefixes: [PREFIXES.DCAT],
    },
    {
      name: "Zeitliche Nähe zu anderen Datensätzen",
      query:
        "SELECT ?dataset ?dayDiff WHERE {\n" +
        "    # hier wird ein Beispieldatensatz verwendet, der sich für die Untersuchung anderer Datensätze beliebig austauschen lässt\n" +
        '    # "Geologische Übersichtskarte der Bundesrepublik Deutschland 1:200.000 (GÜK200) - CC 8742 Bad Reichenhall"\n' +
        "    BIND(<https://gdk.gdi-de.org/inspire/srv/eng/xml_iso19139?uuid=03158696-2C79-48E3-9C61-D205DFA94690> AS ?fixedDataset) .\n" +
        "    ?dataset a dcat:Dataset .\n" +
        "    FILTER(?fixedDataset != ?dataset) .\n" +
        "    ?dataset dct:modified ?modified .\n" +
        "    FILTER(DATATYPE(?modified) IN (xsd:dateTime, xsd:date)) .\n" +
        "    ?fixedDataset dct:modified ?fixedModified .\n" +
        "    BIND(ABS(\n" +
        "        ((YEAR(?modified) - YEAR(?fixedModified)) * 365) +\n" +
        "        ((MONTH(?modified) - MONTH(?fixedModified)) * 30) +\n" +
        "        (DAY(?modified) - DAY(?fixedModified))\n" +
        "    ) AS ?dayDiff) .\n" +
        "} GROUP BY ?dataset ?dayDiff\n" +
        "  ORDER BY ASC(?dayDiff)\n" +
        "LIMIT 100",
      prefixes: [PREFIXES.DCAT, PREFIXES.DCT, PREFIXES.XSD],
    },
    {
      name: "Titel von Datensätzen",
      query:
        "SELECT ?uri ?title ?contributorid WHERE {\n" +
        "    ?uri dct:title ?title .\n" +
        "    # hier werden URIs von Beispieldatensätzen verwendet, die sich mit beliebigen URIs austauschen lassen\n" +
        "    FILTER(?uri IN(<https://opendata.potsdam.de/api/v2/catalog/datasets/obm-2018>, <https://www.offenedaten-wuppertal.de/dataset/fl%C3%A4chennutzungsplan-wuppertal-stand-17012005>, <https://ckan.govdata.de/dataset/0f79531a-e808-5d4c-9d59-a4268a807ae0>))\n" +
        "    ?uri dcatde:contributorID ?contributorid\n" +
        "    FILTER(isURI(?contributorid))\n" +
        '    FILTER(strstarts(str(?contributorid), "http://dcat-ap.de/def/contributors/"))\n' +
        "}",
      prefixes: [PREFIXES.DCATDE, PREFIXES.DCT],
    },
  ],
  mqa: [
    {
      name: "Anzahl der Validierungsergebnisse nach ContributorID",
      query:
        "SELECT ?contributor (COUNT(?report) as ?count)\n" +
        "WHERE {\n" +
        "    ?report rdf:type shacl:ValidationReport .\n" +
        "    ?report mqa:attributedTo ?contributor .\n" +
        "    FILTER(isURI(?contributor))\n" +
        "}\n" +
        "GROUP BY ?contributor\n" +
        "ORDER BY DESC (?count)",
      prefixes: [PREFIXES.MQA, PREFIXES.RDF, PREFIXES.SHACLE],
    },
    {
      name: "Validierungsergebnisse nach Indikator sortiert",
      query:
        "SELECT ?contributor ?metric (COUNT(?metric) as ?count)\n" +
        "WHERE {\n" +
        "    ?report rdf:type shacl:ValidationReport .\n" +
        "    ?report mqa:attributedTo ?contributor .\n" +
        "    FILTER(isURI(?contributor))\n" +
        "    ?report shacl:result ?s .\n" +
        "    ?s shacl:resultSeverity ?metric\n" +
        "    FILTER(!contains(str(?metric), 'count_'))\n" +
        "}\n" +
        "GROUP BY ?contributor ?metric\n" +
        "ORDER BY ASC (?metric) DESC(?count)",
      prefixes: [PREFIXES.MQA, PREFIXES.RDF, PREFIXES.SHACLE],
    },
    {
      name: "URIs aller Datensätze die kein Keyword enthalten",
      query:
        "SELECT DISTINCT ?uri\n" +
        "WHERE {\n" +
        "    ?report rdf:type shacl:ValidationReport .\n" +
        "    ?report shacl:result  ?result .\n" +
        "    # Die Ergebnisse können pro Datenbereitsteller gefiltert werden, hier am Beispiel des Transparenzportals Bremen. Alle möglichen Werte für die ContributorID finden Sie unter: https://www.dcat-ap.de/def/contributors/\n" +
        "    # Hierfür einfach das Hashzeichen in der nachfolgenden Zeile entfernen, um den Filter zu aktivieren.\n" +
        "    #?report mqa:attributedTo <http://dcat-ap.de/def/contributors/transparenzportalBremen> .\n" +
        "    ?result shacl:resultSeverity mqa:no_literal_keyword .\n" +
        "    ?report dqv:computedOn ?uri\n" +
        "} LIMIT 500",
      prefixes: [PREFIXES.DQV, PREFIXES.MQA, PREFIXES.RDF, PREFIXES.SHACLE],
    },
    {
      name: "URIs aller Datensätze die keine offene Lizenz enthalten",
      query:
        "SELECT DISTINCT ?uri\n" +
        "WHERE {\n" +
        "    ?report rdf:type shacl:ValidationReport .\n" +
        "    ?report shacl:result  ?result .\n" +
        "    # Die Ergebnisse können pro Datenbereitsteller gefiltert werden, hier am Beispiel von Open.NRW. Alle möglichen Werte für die ContributorID finden Sie unter: https://www.dcat-ap.de/def/contributors/\n" +
        "    # Hierfür einfach das Hashzeichen in der nachfolgenden Zeile entfernen, um den Filter zu aktivieren.\n" +
        "    #?report mqa:attributedTo <http://dcat-ap.de/def/contributors/openNRW> .\n" +
        "    ?result shacl:resultSeverity mqa:no_open_license_from_list .\n" +
        "    ?report dqv:computedOn ?uri\n" +
        "} LIMIT 500",
      prefixes: [PREFIXES.DQV, PREFIXES.MQA, PREFIXES.RDF, PREFIXES.SHACLE],
    },
  ],
};
