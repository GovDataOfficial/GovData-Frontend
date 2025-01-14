import {
  SortableData,
  SortableDataOption,
} from "@/app/_lib/hooks/useSortableData";

export type MetadataRecord = SortableData & {
  id: string;
  title: string;
  created: string;
  metadataModified: string;
};

export type MetadataOption = SortableDataOption<MetadataRecord> & {
  labelKey: string;
};
