import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "kern-kopfzeile": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        theme?: "light" | "dark";
      };
    }
  }
}
