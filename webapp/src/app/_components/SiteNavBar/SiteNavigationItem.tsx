export type SiteNavigationItem = {
  title: string;
  link: string;
  active?: boolean;
};

export function SiteNavigationItem({
  title,
  link,
  active,
}: SiteNavigationItem) {
  const linkClasses = ["gd-site-navigation-link"];

  if (active) {
    linkClasses.push("selected");
  }

  return (
    <li role="presentation">
      <a
        className={linkClasses.join(" ")}
        href={link}
        role="menuitem"
        tabIndex={0}
      >
        <span className="text-truncate">{title}</span>
      </a>
    </li>
  );
}
