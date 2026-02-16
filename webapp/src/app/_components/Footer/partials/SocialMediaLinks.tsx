import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";

const links = [
  {
    url: process.env.mastodon_url,
    title: i18n.t("footer.social.mastodon"),
    icon: "fa-mastodon",
  },
  {
    url: process.env.linkedin_url,
    title: i18n.t("footer.social.linkedin"),
    icon: "fa-linkedin",
  },
  {
    url: process.env.gitlab_url,
    title: i18n.t("footer.social.gitlab"),
    icon: "fa-gitlab",
  },
].filter((link) => isNotNullOrUndefined(link.url));

export function SocialMediaLinks() {
  if (links.length === 0) {
    return null;
  }

  return (
    <>
      <span className="clr-white paragraph-small">
        {i18n.t("footer.social.visit")}
      </span>
      <ul className="social-icons mt-0_5">
        {links.map((link) => (
          <li key={link.title}>
            <a href={link.url} target="_blank" title={link.title} rel="me">
              <i className={"fa-brands " + link.icon} aria-hidden="true" />
              <span className="offscreen">{link.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
