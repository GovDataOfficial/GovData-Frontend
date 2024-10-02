// @vitest-environment node

import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { withRedirectLegacyPaths } from "@/middlewares/withRedirectLegacyPaths";

vi.spyOn(NextResponse, "redirect");

describe("middleware Redirect", () => {
  const redirectTestCases = [
    ["/web/guest/daten", "/daten"],
    ["/web/guest/showroom", "/suche?type=showcase"],
    ["/web/guest/sparql-assistent", "/sparql-assistent"],
    ["/web/guest/neues", "/blog"],
    ["/web/guest/neues/-/blogs/entwurf-zu-dcat-ap-de-3-0?foo=bar", "blog"],
    ["/web/guest/faq", "/informationen/faq"],
    ["/web/guest/datenschutz", "/datenschutz"],
    ["/web/guest/suchen", "/suche"],
    ["/nutzungsbestimmungen", "/nutzungshinweise"],
    ["/web/guest/nutzungsbestimmungen", "/nutzungshinweise"],
    [
      "/web/guest/erklaerung-zur-barrierefreiheit",
      "/erklaerung-zur-barrierefreiheit",
    ],
    ["/web/guest/impressum", "/impressum"],
    ["/web/guest/suchen/-/details/testfoo", "/suche/daten/testfoo"],
    ["/web/guest/suchen/-/details/123", "/suche/anwendung/123"],
    ["/web/guest/suchen/-/searchresult/s/title_asc", "/suche?sort=title_asc"],
    [
      "/web/guest/suchen/-/searchresult/s/title_asc/blubb",
      "/suche?sort=title_asc",
    ],
    [
      "/web/guest/suchen/-/searchresult/f/showcase_types%3Awebsite%2C/s/relevance_desc",
      "suche?showcase_types=website&sort=relevance_desc",
    ],
    [
      "/web/guest/suchen/-/searchresult/q/Mein+Test/f/tags%3Abau%2C/s/title_asc",
      "/suche?q=Mein%2BTest&tags=bau&sort=title_asc",
    ],
    [
      "/web/guest/suchen/-/searchresult/q/hey/boundingbox/8.959643639794923%2C47.62869595029784%2C9.351649560205077%2C47.71192506728127",
      "https://test.de/suche?q=hey&boundingbox=8.959643639794923%2C47.62869595029784%2C9.351649560205077%2C47.71192506728127",
    ],
    [
      "/web/guest/suchen/-/searchresult/start/03.07.2024/end/17.07.2024",
      "/suche?start=2024-07-03&end=2024-07-17",
    ],
    [
      // double encoding check
      "/web/guest/suchen/-/searchresult/f/licence%3Ahttp%253A%252F%252Fdcat-ap.de%252Fdef%252Flicenses%252Fdl-by-de%252F2.0%2C",
      "/suche?licence=http%3A%2F%2Fdcat-ap.de%2Fdef%2Flicenses%2Fdl-by-de%2F2.0",
    ],
    [
      "/web/guest/daten/-/searchresult/q/test/f/type%3Adataset%2Cgroups%3Aener%2C/s/relevance_desc",
      "/suche?q=test&type=dataset&groups=ener&sort=relevance_desc",
    ],
    [
      "/web/guest/showroom/-/searchresult/f/type%3Ashowcase%2Cshowcase_types%3Awebsite%2C/s/relevance_desc",
      "/suche?type=showcase&showcase_types=website&sort=relevance_desc",
    ],
    ["/web/guest/open-government", "informationen/open-government"],
    ["/open-government", "informationen/open-government"],
    ["/web/guest/datenbereitsteller", "informationen/datenbereitsteller"],
    ["/datenbereitsteller", "informationen/datenbereitsteller"],
    ["/web/guest/lizenzen", "informationen/lizenzen"],
    ["/lizenzen", "informationen/lizenzen"],
    ["/web/guest/faq", "informationen/faq"],
    ["/faq", "informationen/faq"],
    ["/web/guest/hilfe", "informationen/hilfe"],
    ["/hilfe", "informationen/hilfe"],
    ["/web/guest/metadatenschema", "informationen/metadatenschema"],
    ["/metadatenschema", "informationen/metadatenschema"],
    ["/web/guest/termine", "informationen/termine"],
    ["/termine", "informationen/termine"],
    ["/web/guest/ogd-dachli", "informationen/ogd-dachli"],
    ["/ogd-dachli", "informationen/ogd-dachli"],
    [
      "/web/guest/datenbereitstellungaufgovdata",
      "informationen/datenbereitstellungaufgovdata",
    ],
    [
      "/datenbereitstellungaufgovdata",
      "informationen/datenbereitstellungaufgovdata",
    ],
    [
      "/daten/-/details/govdata-metadatenkatalog",
      "/suche/daten/govdata-metadatenkatalog",
    ],
    ["/web/guest/kontakt", "/kontakt"],
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // shuffle before run to make sure paths are mapped correctly
  const shuffledTestCases = redirectTestCases.sort(() => Math.random() - 0.5);

  test.each(shuffledTestCases)("should redirect %s -> %s", (oldUrl, newUrl) => {
    const base = "https://test.de";
    const request = new Request(new URL(oldUrl, base));
    const expectedRedirect = new URL(newUrl, base);
    const response = withRedirectLegacyPaths(
      new NextRequest(request),
      new NextResponse(),
    );
    expect(response).not.toBeUndefined();
    response!();
    expect(NextResponse.redirect).toHaveBeenCalledWith(expectedRedirect, {
      status: 308,
    });
  });
});
