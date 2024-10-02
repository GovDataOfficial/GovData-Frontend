import { SiteNavigationItem } from "@/app/_components/SiteNavBar/SiteNavigationItem";
import { usePathname } from "next/navigation";
import { ContainerDiv } from "@/app/_components/Container";

export type SiteNavigation = {
  items: SiteNavigationItem[] | undefined;
  label: string;
  theme?: "magenta";
};

export function SiteNavigation({ items, label, theme }: SiteNavigation) {
  const pathname = usePathname();
  const classes = ["gd-site-navigation"];

  if (!items || items.length === 0) {
    return null;
  }

  if (theme === "magenta") {
    classes.push("magenta");
  }

  return (
    <div className={classes.join(" ")}>
      <ContainerDiv containerWidth="lg">
        <ul aria-label={label} role="menubar">
          {items.map((subPage) => (
            <SiteNavigationItem
              key={subPage.title}
              {...subPage}
              active={pathname === subPage.link}
            />
          ))}
        </ul>
      </ContainerDiv>
    </div>
  );
}
