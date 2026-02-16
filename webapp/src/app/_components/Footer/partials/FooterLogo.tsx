// Don't use Image from 'next/image' here to be more flexible with image dimensions
/* eslint-disable @next/next/no-img-element */

export function FooterLogo() {
  return (
    <div className="footer-logo">
      <a href={process.env.footer_logo_link || "/"}>
        <img
          alt={process.env.footer_logo_link_alt || ""}
          src="/images/footer_logo.svg"
        />
      </a>
    </div>
  );
}
