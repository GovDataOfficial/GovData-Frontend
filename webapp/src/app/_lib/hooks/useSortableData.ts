import { useEffect, useState } from "react";

export type Direction = "ascending" | "descending" | undefined;


export type SortableData = {
    [key: string]: any
};

export type SortableDataOption<T extends SortableData> = {
    key: keyof T;
    sort?: (a: any, b: any, direction?: Direction) => number;
};

export type SortConfig = {
    key: keyof SortableData;
    direction: Direction;
}

const sortData = <T extends SortableData>(data: T[], config: SortConfig, options: SortableDataOption<T>[]) => {
    return [...data].sort((a, b) => {
        const aValue = a[config.key];
        const bValue = b[config.key];

        // Handle undefined values
        if (aValue == null || bValue == null) {
            return aValue == null
                ? config.direction === "ascending"
                    ? 1
                    : -1
                : config.direction === "ascending"
                    ? -1
                    : 1;
        }

        const option = options.find((col) => col.key === config.key);

        // Custom sort function
        if (option?.sort) {
            return option.sort(aValue, bValue, config.direction);
        }

        // Default string comparison
        if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return config.direction === "ascending" ? -1 : 1;
        }
        if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return config.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });
}

export function useSortableData<T extends SortableData>(data: T[], options: SortableDataOption<T>[], initialSortConfig?: SortConfig) {

    const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(initialSortConfig);
    const [sortedData, setSortedData] = useState(() => {
        if (initialSortConfig) {
            return sortData(data, initialSortConfig, options);
        }
        return data;
    });

    useEffect(() => {
        if (!sortConfig) {
            setSortedData(data);
            return;
        }
        setSortedData(sortData(data, sortConfig, options));
    }, [data, sortConfig, options]);

    const sortByKeyAndDirection = (key: keyof SortableData, givenDirection?: Direction) => {

        if (givenDirection) {
            setSortConfig({ key, direction: givenDirection });
            return;
        }

        // Toggles direction if not explicitly provided
        let direction: "ascending" | "descending" = "ascending";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "ascending"
        ) {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    return { sortByKeyAndDirection, sortedData, sortConfig }

}