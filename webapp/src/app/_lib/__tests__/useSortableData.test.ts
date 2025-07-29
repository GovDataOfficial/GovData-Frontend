import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import {
  SortableData,
  SortableDataOption,
  useSortableData,
} from "../hooks/useSortableData";

type TestData = SortableData & { name: string; age: string };

const data: TestData[] = [
  { name: "Foo", age: "30" },
  { name: "Bar", age: "25" },
  { name: "Baz", age: "35" },
];

const columns: SortableDataOption<TestData>[] = [
  { key: "name" },
  {
    key: "age",
    sort: (a, b, direction) => (direction === "ascending" ? +a - +b : +b - +a),
  },
];

describe("useSortableData", () => {
  it("should return the initial data unsorted", () => {
    const { result } = renderHook(() => useSortableData(data, columns));
    expect(result.current.sortedData).toEqual(data);
  });

  it("should sort data by name in ascending order", async () => {
    const { result } = renderHook(() => useSortableData(data, columns));

    await act(() => {
      result.current.sortByKeyAndDirection("name", "ascending");
    });

    expect(result.current.sortedData).toEqual([
      { name: "Bar", age: "25" },
      { name: "Baz", age: "35" },
      { name: "Foo", age: "30" },
    ]);
  });

  it("should sort data by name in descending order", async () => {
    const { result } = renderHook(() => useSortableData(data, columns));

    await act(() => {
      result.current.sortByKeyAndDirection("name", "descending");
    });

    expect(result.current.sortedData).toEqual([
      { name: "Foo", age: "30" },
      { name: "Baz", age: "35" },
      { name: "Bar", age: "25" },
    ]);
  });

  it("should toggle sort direction for a key", async () => {
    const { result } = renderHook(() => useSortableData(data, columns));

    await act(() => {
      result.current.sortByKeyAndDirection("name");
    });

    expect(result.current.sortedData).toEqual([
      { name: "Bar", age: "25" },
      { name: "Baz", age: "35" },
      { name: "Foo", age: "30" },
    ]);

    await act(() => {
      result.current.sortByKeyAndDirection("name");
    });

    expect(result.current.sortedData).toEqual([
      { name: "Foo", age: "30" },
      { name: "Baz", age: "35" },
      { name: "Bar", age: "25" },
    ]);
  });

  it("should sort data by age using custom sort function", async () => {
    const { result } = renderHook(() => useSortableData(data, columns));

    await act(() => {
      result.current.sortByKeyAndDirection("age", "ascending");
    });

    expect(result.current.sortedData).toEqual([
      { name: "Bar", age: "25" },
      { name: "Foo", age: "30" },
      { name: "Baz", age: "35" },
    ]);
  });

  it("should sort data with an initial sort configuration", () => {
    const { result } = renderHook(() =>
      useSortableData(data, columns, { key: "age", direction: "descending" }),
    );

    expect(result.current.sortedData).toEqual([
      { name: "Baz", age: "35" },
      { name: "Foo", age: "30" },
      { name: "Bar", age: "25" },
    ]);
  });
});
