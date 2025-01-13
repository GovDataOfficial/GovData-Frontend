import {
  SortableData,
  SortableDataOption,
} from "@/app/_lib/hooks/useSortableData";

export type MetaDataRecord = SortableData & {
  id: string;
  title: string;
  created: string;
  metadataModified: string;
};

export type MetaDataOption = SortableDataOption<MetaDataRecord> & {
  labelKey: string;
};
