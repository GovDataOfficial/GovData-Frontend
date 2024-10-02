import { T3ContentElements, T3Page } from "@/types/types.typo3";

export const isNotNullOrUndefined = <T>(
  value: T | undefined | null,
): value is T => !!value;

function findByType<T extends T3ContentElements["type"]>(type: T) {
  return <Param extends T3ContentElements>(
    element: Param,
  ): element is Extract<Param, { type: T }> => element.type === type;
}

function filterByTypes<T extends T3ContentElements["type"][]>(types: T) {
  return <Param extends T3ContentElements>(
    element: Param,
  ): element is Extract<Param, { type: T[number] }> => {
    return types.includes(element.type);
  };
}

export function findT3ContentElement<T extends T3ContentElements["type"]>(
  page: T3Page | null | undefined,
  type: T,
) {
  return page?.content.colPos0?.find(findByType(type));
}

export function filterT3ContentElements<T extends T3ContentElements["type"][]>(
  page: T3Page | null | undefined,
  types: T,
) {
  return page?.content.colPos0?.filter(filterByTypes(types));
}
