"use client";

import { usePathname } from "next/navigation";

export type MenuItem = {
  href: string;
  name: string;
  color?: string;
  subMenu?: MenuItem[];
};

export function MenuItem({ href, name, color }: MenuItem) {
  const path = usePathname();

  const isActive = path === href || path.startsWith(href);
  const linkClasses = ["gd-navbar-link"];

  if (isActive) {
    linkClasses.push("active");
  }

  if (color) {
    linkClasses.push(`bg-${color}`);
  }

  return (
    <li className="gd-navbar-list-item" role="presentation">
      <a
        href={href}
        role="menuitem"
        title={name}
        className={linkClasses.join(" ")}
      >
        {name}
      </a>
    </li>
  );
}
