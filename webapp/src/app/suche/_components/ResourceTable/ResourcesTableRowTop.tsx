import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { AnchorButton } from "@/app/_components/Button/AnchorButton";
import { CopyToClipboardButton } from "@/app/_components/Button/CopyToClipboardButton";
import { Tag } from "@/app/_components/Tag/Tag";
import { Time } from "@/app/_components/Time/Time";
import { i18n } from "@/i18n";
import { MetadataResource } from "@/types/types";

export const getTitle = (nameOnlyText = "", formatShort = "") => {
  if (!nameOnlyText || nameOnlyText == "") {
    return `${formatShort?.toUpperCase()}-Ressource`;
  }

  return nameOnlyText;
};

export const createNoJsLink = (
  searchParams: ReadonlyURLSearchParams,
  id: string,
) => {
  const params = new URLSearchParams(searchParams);

  if (params.has("ids", id)) {
    params.delete("ids", id);
  } else {
    params.append("ids", id);
  }
  return `?${params.toString()}`;
};

export const removeSearchParameters = (
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
  pathname: string,
) => {
  const params = new URLSearchParams(searchParams);

  if (params.has("ids")) {
    router.replace(pathname);
  }
};

export function ResourcesTableRowTop({
  resource,
  open,
  onClick,
}: {
  resource: MetadataResource;
  open: boolean;
  onClick: (id: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { id, nameOnlyText, modified, url, formatShort } = resource;

  return (
    <tr key={id}>
      <td>
        <a
          role="button"
          className="gd-a-button-icon"
          onClick={(e) => {
            e.preventDefault();
            removeSearchParameters(searchParams, router, pathname);
            onClick(id);
          }}
          aria-controls={id}
          aria-expanded={open}
          href={createNoJsLink(searchParams, id)}
        >
          <strong className="gd-a-button-icon-summary">
            {getTitle(nameOnlyText, formatShort)}
          </strong>
        </a>
      </td>
      <td>{modified ? <Time date={modified} /> : "-"}</td>
      <td>
        <Tag truncate uppercase title={formatShort}>
          {formatShort}
        </Tag>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <AnchorButton href={url} variant="secondary">
            {i18n.t("resources.table.row.resource.button")}
          </AnchorButton>
          <CopyToClipboardButton url={url} />
        </div>
      </td>
    </tr>
  );
}
