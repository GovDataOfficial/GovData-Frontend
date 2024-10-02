import { useEffect, useRef, useState } from "react";
import type Yasgui from "@triply/yasgui";

import { Prefix } from "@/app/sparql-assistent/SparqlEditor/types";

export const useYasgui = (containerId: string, endpoint: string) => {
  const isLoading = useRef(false);
  const loaded = useRef(false);

  const [yasgui, setYasgui] = useState<Yasgui | null>(null);

  const yasguiRef = useRef<any>(null);

  const execQuery = () => {
    const tab = yasgui?.getTab();
    if (yasgui && tab) {
      tab.query();
    }
  };

  const getYasqe = () => {
    if (yasgui) {
      const tab = yasgui.getTab();

      if (tab) {
        return tab.getYasqe();
      }
    }

    return null;
  };

  const setQuery = (query: string) => {
    const yasqe = getYasqe();
    if (yasqe) {
      yasqe.setValue(query);
    }
  };

  const togglePrefix = (prefix: Prefix) => {
    const yasqe = getYasqe();
    if (yasqe) {
      const currentPrefixes = yasqe.getPrefixesFromQuery();
      if (prefix.key in currentPrefixes) {
        yasqe.removePrefixes({ [prefix.key]: prefix.scheme });
        return;
      }

      yasqe.addPrefixes({
        ...currentPrefixes,
        [prefix.key]: prefix.scheme,
      });
    }
  };

  const setEndpoint = (endpoint: string) => {
    if (yasgui) {
      const tab = yasgui.getTab();
      tab?.setRequestConfig({ endpoint });
      yasgui.config.requestConfig.endpoint = endpoint;
    }
  };

  const setPrefixes = (prefixes: { key: string; scheme: string }[]) => {
    const yasqe = getYasqe();
    if (yasqe) {
      yasqe.addPrefixes(
        prefixes.reduce((prev, prefix) => {
          return {
            ...prev,
            [prefix.key]: prefix.scheme,
          };
        }, {}),
      );
    }
  };

  const setContentType = (contentType: string) => {
    if (yasgui) {
      const tab = yasgui.getTab();

      tab?.setRequestConfig({ acceptHeaderSelect: contentType });
      yasgui.config.requestConfig.acceptHeaderSelect = contentType;
    }
  };

  const renderContainer = () => {
    return <div id={containerId} className="col-12 custom-sparql-layout" />;
  };

  useEffect(() => {
    if (!isLoading.current && !yasguiRef.current) {
      const importYasgui = async () => {
        if (!isLoading.current && !yasguiRef.current) {
          isLoading.current = true;

          const YasguiDefault = (await import("@triply/yasgui")).default;
          const container = document.getElementById(containerId);

          if (container) {
            if (YasguiDefault) {
              // @ts-ignore
              yasguiRef.current = new YasguiDefault(container, {
                autofocus: false,
                requestConfig: {
                  endpoint,
                  method: "GET",
                },
                copyEndpointOnNewTab: false,
              });
              loaded.current = true;

              setYasgui(yasguiRef.current);

              yasgui?.getTab()?.setEndpoint(endpoint);
            }
          }

          isLoading.current = false;
        }
      };

      importYasgui();
    }
  }, [containerId, endpoint, yasgui]);

  return {
    yasgui,
    setQuery,
    setPrefixes,
    togglePrefix,
    loaded: !!yasgui,
    execQuery,
    setContentType,
    setEndpoint,
    renderContainer,
  };
};
