import {
  SortableData,
  SortableDataOption,
} from "@/app/_lib/hooks/useSortableData";

export type ShowcaseRecord = SortableData & {
  id: string;
  title: string;
  name: string;
  releaseDate: string;
  metadataModified: string;
};

export type ShowcaseOption = SortableDataOption<ShowcaseRecord> & {
  labelKey: string;
};
