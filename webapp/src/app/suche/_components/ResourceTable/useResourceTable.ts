import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useResourceTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const idsFromUrl = searchParams.getAll("ids") || [];

  const [openIds, setOpenIds] = useState<{ [key: string]: boolean }>(
    idsFromUrl.reduce((prev, value) => ({ ...prev, [value]: true }), {}),
  );

  const handleOnClick = (id: string) => {
    setOpenIds({
      ...openIds,
      [id]: !openIds[id],
    });
  };

  const paramsIds = searchParams.getAll("ids");

  return {
    handleOnClick,
    openIds,
    paramsIds,
    searchParams,
    router,
    pathname,
  };
}
