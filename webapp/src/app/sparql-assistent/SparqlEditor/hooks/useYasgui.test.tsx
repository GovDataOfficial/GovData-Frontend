import { afterEach, describe, expect, it, vi } from "vitest";
import { render, renderHook, waitFor } from "@testing-library/react";
import { useYasgui } from "@/app/sparql-assistent/SparqlEditor/hooks/useYasgui";

function TestContainer() {
  return <div id="yasgui"></div>;
}

const MockTabsStRequestConfig = vi.fn();
const MockYasguiTab = vi.fn();
const MockTabQuery = vi.fn();
const MockYasqeSetValue = vi.fn();
const MockYasqeAddPrefixes = vi.fn();
const MockYasqeRemovePrefix = vi.fn();
const MockYasqeGetPrefixesFromQuery = vi.fn();

const YasguiMock = vi.fn().mockReturnValue({
  config: {
    requestConfig: {
      acceptHeaderSelect: "",
      endpoint: "",
    },
  },
  getTab: MockYasguiTab.mockReturnValue({
    setRequestConfig: MockTabsStRequestConfig,
    query: MockTabQuery,
    getYasqe: vi.fn().mockReturnValue({
      setValue: MockYasqeSetValue,
      addPrefixes: MockYasqeAddPrefixes,
      removePrefixes: MockYasqeRemovePrefix,
      getPrefixesFromQuery: MockYasqeGetPrefixesFromQuery,
    }),
  }),
});

vi.mock("@triply/yasgui", () => ({
  default: YasguiMock,
}));

const initHook = async () => {
  render(<TestContainer />);
  const { result } = renderHook(() => useYasgui("yasgui", "/api"));
  await waitFor(() => {
    expect(result.current.loaded).toBe(true);
  });

  return result;
};

describe("useYasgui", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should init yasgui correctly", async () => {
    const result = await initHook();
    expect(result.current.yasgui).toBeDefined();
  });

  it("should set a query for yasgui", async () => {
    const result = await initHook();

    result.current.setQuery("any");

    expect(MockYasqeSetValue).toHaveBeenCalledOnce();
    expect(MockYasqeSetValue).toHaveBeenCalledWith("any");
  });

  it("should set prefixes for yasgui", async () => {
    const result = await initHook();

    result.current.setPrefixes([
      { key: "a", scheme: "A" },
      { key: "b", scheme: "B" },
    ]);

    expect(MockYasqeAddPrefixes).toHaveBeenCalledOnce();
    expect(MockYasqeAddPrefixes).toHaveBeenCalledWith({ a: "A", b: "B" });
  });

  it("should toggle prefixes", async () => {
    const result = await initHook();

    MockYasqeGetPrefixesFromQuery.mockReturnValue({
      a: "A",
      b: "B",
    });

    result.current.togglePrefix({ key: "a", scheme: "A" });
    expect(MockYasqeRemovePrefix).toHaveBeenCalledWith({ a: "A" });

    result.current.togglePrefix({ key: "c", scheme: "C" });
    expect(MockYasqeAddPrefixes).toHaveBeenCalledWith({
      a: "A",
      b: "B",
      c: "C",
    });
  });

  it("should exec a query", async () => {
    const result = await initHook();

    result.current.execQuery();
    expect(MockTabQuery).toHaveBeenCalledOnce();
  });

  it("should set the content type for yasgui", async () => {
    const result = await initHook();

    result.current.setContentType("type: test");

    expect(MockTabsStRequestConfig).toHaveBeenCalledWith({
      acceptHeaderSelect: "type: test",
    });
    expect(result.current.yasgui?.config.requestConfig.acceptHeaderSelect).toBe(
      "type: test",
    );
  });

  it("should set a new endpoint for yasgui", async () => {
    const result = await initHook();

    result.current.setEndpoint("/api/new");
    expect(MockTabsStRequestConfig).toHaveBeenCalledWith({
      endpoint: "/api/new",
    });
    expect(result.current.yasgui?.config.requestConfig.endpoint).toBe(
      "/api/new",
    );
  });

  it("should render the yasgui container", async () => {
    const result = await initHook();

    const container = result.current.renderContainer();

    expect(container.props.id).toBe("yasgui");
  });
});
