import { MetaData, ShowCaseData } from "@/types/types";

export const metaDataTestProps = {
  id: "dc5bd01d-8872-4a95-8c36-3e2342bc517c",
  averageRating: 0.0,
  categories: [
    {
      name: "envi",
      displayName: "Umwelt",
      title: "Umwelt",
      count: 0,
      description: "",
    },
  ],
  title: "Naturräume Geest und Marsch",
  name: "metadata_max",
  type: "DATASET",
  notes: "test-notes",
  url: "https://www.govdata.de/web/guest/daten/-/details/naturraume-geest-und-marsch3",
  resources: [
    {
      id: "3013fd33-0e42-4cb8-a61c-d92d8a2a3284",
      name: "Download WFS Naturräume Geest und Marsch (GML)",
      nameOnlyText: "Download WFS Naturräume Geest und Marsch (GML)",
      description: "Das ist eine deutsche Beschreibung der Distribution 1",
      descriptionOnlyText:
        "Das ist eine deutsche Beschreibung der Distribution 1",
      url: "http://geodienste.hamburg.de/Geest-_Marsch",
      format:
        "https://www.iana.org/assignments/media-types/application/gml+xml",
      formatShort: "application/gml+xml",
      language: ["de"],
      issued: "2017-02-27T00:00:00",
      modified: "2017-03-07T10:00:00",
      license: {
        id: "http://dcat-ap.de/def/licenses/dl-by-de/2.0",
        title: "Datenlizenz Deutschland Namensnennung 2.0",
        url: "https://www.govdata.de/dl-de/by-2-0",
        odConformance: "approved",
        osdConformance: "approved",
        open: true,
        active: true,
      },
      open: true,
      licenseAttributionByText:
        "Freie und Hansestadt Hamburg, Behörde für Umwelt und Energie, 2015",
      plannedAvailability:
        "http://dcat-ap.de/def/plannedAvailability/available",
      availability:
        "http://publications.europa.eu/resource/authority/planned-availability/STABLE",
      availabilityDisplay:
        "http://publications.europa.eu/resource/authority/planned-availability/STABLE",
      shortendAvailability: "STABLE" as const,
      accessServices: [
        {
          description:
            "This SPARQL end point allow to directly query the EU Whoiswho content",
          title: "Sparql-end Point",
          endpointDescription: "SPARQL url description",
          license: {
            id: "http://dcat-ap.de/def/licenses/dl-by-de/2.0",
            title: "Datenlizenz Deutschland Namensnennung 2.0",
            url: "https://www.govdata.de/dl-de/by-2-0",
            odConformance: "approved",
            osdConformance: "approved",
            open: true,
            active: true,
          },
          licenseAttributionByText: "License text",
          accessRights:
            "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
          availability:
            "http://publications.europa.eu/resource/authority/planned-availability/AVAILABLE",
          shortendAvailability: "AVAILABLE",
          open: true,
          endpointUrls: [
            "http://publications.europa.eu/webapi/rdf/sparql",
            "http://publications.europa.eu/webapi/rdf/sparql2",
          ],
          servesDataset: [
            "http://data.europa.eu/88u/dataset/eu-whoiswho-the-official-directory-of-the-european-union",
            "http://data.europa.eu/88u/dataset/eu-whoiswho-the-official-directory-of-the-european-union",
          ],
        },
      ],
      hvd: true,
    },
    {
      id: "53360ea3-7fbc-489b-bc4e-a9cefb24e7bc",
      name: "Download WFS Naturräume Geest und Marsch (GML)",
      nameOnlyText: "Download WFS Naturräume Geest und Marsch (GML)",
      description: "Das ist eine deutsche Beschreibung der Distribution 4",
      descriptionOnlyText:
        "Das ist eine deutsche Beschreibung der Distribution 4",
      url: "http://daten-hamburg.de/umwelt_klima/naturraeume_geest_und_marsch/Naturraeume_Geest_und_Marsch_HH_2017-02-20.zip_abweichend",
      format: "http://publications.europa.eu/resource/authority/file-type/ZIP",
      formatShort: "ZIP",
      language: ["de"],
      issued: "2017-02-27T00:00:00",
      modified: "2017-03-07T10:00:00",
      license: {
        id: "http://dcat-ap.de/def/licenses/dl-by-de/2.0",
        title: "Datenlizenz Deutschland Namensnennung 2.0",
        url: "https://www.govdata.de/dl-de/by-2-0",
        odConformance: "approved",
        osdConformance: "approved",
        open: true,
        active: true,
      },
      open: true,
      licenseAttributionByText:
        "Freie und Hansestadt Hamburg, Behörde für Umwelt und Energie, 2015",
      plannedAvailability:
        "http://dcat-ap.de/def/plannedAvailability/available",
      availability:
        "http://publications.europa.eu/resource/authority/planned-availability/EXPERIMENTAL",
      availabilityDisplay:
        "http://publications.europa.eu/resource/authority/planned-availability/EXPERIMENTAL",
      shortendAvailability: "EXPERIMENTAL",
      accessServices: [
        {
          description:
            "This SPARQL end point allow to directly query the EU Whoiswho content 2",
          title: "Sparql-end Point 2",
          endpointDescription: "SPARQL url description 2",
          license: {
            id: "http://publications.europa.eu/resource/authority/licence/CC_BY",
            open: false,
            active: false,
          },
          licenseAttributionByText: "License text 2",
          accessRights:
            "http://publications.europa.eu/resource/authority/access-right/OP_DATPRO",
          availability:
            "http://publications.europa.eu/resource/authority/planned-availability/EXPERIMENTAL",
          shortendAvailability: "EXPERIMENTAL",
          open: false,
          endpointUrls: [
            "http://publications.europa.eu/webapi/rdf/sparql",
            "http://publications.europa.eu/webapi/rdf/sparql2",
          ],
          servesDataset: [
            "http://data.europa.eu/88u/dataset/eu-whoiswho-the-official-directory-of-the-european-union",
            "https://data.europa.eu/data/datasets/635794f684a0afb9e2b40ce7?locale=de",
          ],
        },
      ],
      hvd: false,
    },
  ],
  tags: [
    { name: "Bodenschutz", count: 0, description: "Bodenschutz" },
    { name: "Geodaten", count: 0, description: "Geodaten" },
    { name: "Grundwasser", count: 0, description: "Grundwasser" },
    { name: "Karte", count: 0, description: "Karte" },
    { name: "Thematische Karte", count: 0, description: "Thematische Karte" },
    { name: "Umwelt und Klima", count: 0, description: "Umwelt und Klima" },
    { name: "hmbtg", count: 0, description: "hmbtg" },
    { name: "hmbtg_09_geodaten", count: 0, description: "hmbtg_09_geodaten" },
    { name: "opendata", count: 0, description: "opendata" },
  ],
  contacts: [
    {
      name: "Behörde für Umwelt und Energie (BUE), Amt für Umweltschutz",
      url: "http://www.hamburg-3 .de/bue/",
      address: {},
      role: "PUBLISHER",
    },
    {
      name: "Peter Schröder",
      url: "http://www.hamburg-1 .de/bue/",
      email: "michael.schroeder @bue.hamburg.de",
      address: {
        street: "Beispielstraße 4",
        city: "Beispielort",
        zip: "12345",
        country: "DE",
      },
      role: "MAINTAINER",
    },
  ],
  lastModifiedDate: "2024-01-25T13:52:20",
  temporalCoverageFrom: "2016-01-01T00:00:00",
  temporalCoverageTo: "2016-12-31T00:00:00",
  owner_org: "30b7e9ef-327c-4f32-9591-70a88bcbdda4",
  creator_user_id: "d6ca072e-17fd-4ba2-a70e-bbb70467456d",
  open: true,
  geocodingText: ["Hamburg"],
  contributorID: [
    "http://dcat-ap.de/def/contributors/transparenzportalHamburg",
  ],
  legalbasisText: ["Umweltinformationsgesetz (UIG)"],
  politicalGeocodingURI: [
    "http://dcat-ap.de/def/politicalGeocoding/regionalKey/020000000000",
    "http://dcat-ap.de/def/politicalGeocoding/stateKey/02",
  ],
  policiticalGeocodingLevelURI:
    "http://dcat-ap.de/def/politicalGeocoding/Level/state",
  spatial:
    '{"type":"Polygon","coordinates":[[[10.3263,53.3949],[10.3263,53.9641],[8.4205,53.9641],[8.4205,53.3949],[10.3263,53.3949]]]}',
  qualityProcessURI: "https://www.example.com/",
  resourcesLicenses: [
    {
      id: "http://dcat-ap.de/def/licenses/dl-by-de/2.0",
      title: "Datenlizenz Deutschland Namensnennung 2.0",
      url: "https://www.govdata.de/dl-de/by-2-0",
      odConformance: "approved",
      osdConformance: "approved",
      open: true,
      active: true,
    },
  ],
  state: "active",
  hvdCategories: ["MET", "GEO"],
  applicableLegislation: [
    "http://data.europa.eu/eli/reg_impl/2023/138/oj",
    "http://data.europa.eu/eli/reg_impl/2023/138/oj_alt",
  ],
  hvd: true,
  private: false,
} satisfies MetaData;

export const showCaseTestData = {
  id: 1,
  title: "Mein Test Showcase",
  notes: "Test Notes",
  showcaseTypes: [
    { id: 1, name: "tool", primaryShowcase: false },
    { id: 3, name: "concept", primaryShowcase: true },
    { id: 2, name: "visualization", primaryShowcase: false },
  ],
  images: [],
  linksToShowcase: [
    { id: 9, name: "Anwendung 1", url: "http://www.google.de" },
  ],
  usedDatasets: [{ id: 9, name: "Datensatz 1", url: "http://test/0d981e97" }],
  platforms: [
    { id: 1, name: "android" },
    { id: 2, name: "ios" },
  ],
  linkToSourcesUrl: "http://www.google.de",
  linkToSourcesName: "Link",
  categories: [
    { id: 1, name: "soci" },
    { id: 2, name: "agri" },
  ],
  keywords: [
    { id: 1, name: "key" },
    { id: 2, name: "word" },
  ],
  website: "",
  manualShowcaseCreatedDate: 1622505600000,
  usecasePublisher: "",
  usecaseSourceUrl: "",
  creatorUserId: "10401",
  modifyDate: 1682496806974,
  hidden: false,
  createDate: 1623676691225,
} satisfies ShowCaseData;
