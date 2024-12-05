import { SortableData, SortableDataOption } from "@/app/_lib/hooks/useSortableData";


export type MetaDataRecord = SortableData & {
    id: string;
    title: string;
    created: string;
    lastModified: string;
};

export type MetaDataOption = SortableDataOption<MetaDataRecord> & {
    labelKey: string;
};