import { i18n } from "@/i18n";
import { fetchTypo3Data } from "@/app/_lib/getData";
import { findT3ContentElement } from "@/types/typeGuards";
import { endpoints } from "@/configuration/endpoints";
import { PAGES } from "@/app/_lib/URLHelper";
import { SocialMediaLinks } from "@/app/_components/Footer/partials/SocialMediaLinks";

export async function Footer() {
  const data = await fetchTypo3Data(endpoints.T3Api.footer);
  const subPages = findT3ContentElement(data, "menu_subpages");

  return (
    <footer className="mt-5">
      <div className="container-lg">
        <div className="row align-items-center my-2">
          <SocialMediaLinks />
          <div className="col-12 col-sm-7 text-md-right order-first order-sm-last">
            <ul className="footer-links">
              <li className="d-block d-md-inline-block">
                <a className="normal paragraph-small" href={PAGES.contact}>
                  {i18n.t("contact.page.title")}
                </a>
              </li>
              {subPages?.content.menu.map((subPage) => (
                <li key={subPage.link} className="d-block d-md-inline-block">
                  <a className="normal paragraph-small" href={subPage.link}>
                    {subPage.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
