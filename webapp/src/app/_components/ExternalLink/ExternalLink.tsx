type ExternalLink = {
  href: string;
  title?: string;
  className?: string;
};

export function ExternalLink({ title, href, className = "" }: ExternalLink) {
  return (
    <a
      className={`external-link ${className}`}
      href={href}
      target="_blank"
      rel="nofollow"
    >
      {title || href}
    </a>
  );
}
