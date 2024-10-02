import Image from "next/image";
import { icons } from "@/app/_components/SVG/iconMap";

export { icons };
export function SVG({
  icon,
  size,
  className,
}: {
  icon: keyof typeof icons;
  size?: "small" | "big" | "32" | "14";
  className?: string;
}) {
  const getIconSize = () => {
    switch (size) {
      case "big":
        return "gd-icon-container-big";
      case "small":
        return "gd-icon-container-small";
      case "32":
        return "gd-icon-container-32";
      case "14":
        return "gd-icon-container-14";
      default:
        return "";
    }
  };

  return (
    <span className={`gd-icon ${className ? className : ""}`}>
      <span className={`gd-icon-container ${getIconSize()}`}>
        <Image src={icon} alt="" unoptimized fill loading="eager" />
      </span>
    </span>
  );
}
