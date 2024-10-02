"use client";

import { SelectEndpoint } from "@/app/sparql-assistent/SparqlEditor/components/SelectEndpoint";
import { useEffect, useState } from "react";
import {
  endpointOptions,
  formatOptions,
  PREFIXES,
  QUERIES,
} from "@/app/sparql-assistent/SparqlEditor/data";
import { i18n } from "@/i18n";
import { EndpointInfo } from "@/app/sparql-assistent/SparqlEditor/components/EndpointInfo";
import { useYasgui } from "@/app/sparql-assistent/SparqlEditor/hooks/useYasgui";
import { SelectFormat } from "@/app/sparql-assistent/SparqlEditor/components/SelectFormat";
import "@triply/yasgui/build/yasgui.min.css";
import { ContainerDiv } from "@/app/_components/Container";

const initialEndpoint = endpointOptions[0].key;
const initialFormat = formatOptions[0].key;

type SectionSparqlEditor = {
  endpoints: {
    ds: string;
    mqa: string;
  };
};

export function SectionSparqlEditor({ endpoints }: SectionSparqlEditor) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(initialEndpoint);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat);

  const {
    setQuery,
    setPrefixes,
    togglePrefix,
    loaded,
    execQuery,
    setContentType,
    setEndpoint,
    renderContainer,
  } = useYasgui("yasgui", endpoints.ds);

  let queryOptions = QUERIES[selectedEndpoint];

  useEffect(() => {
    if (selectedEndpoint && loaded) {
      setQuery(queryOptions[0].query);
      setPrefixes(queryOptions[0].prefixes);
    }
  }, [loaded, selectedEndpoint, setQuery, setPrefixes, queryOptions]);

  useEffect(() => {
    setContentType(selectedFormat);
  }, [selectedFormat, setContentType]);

  useEffect(() => {
    setEndpoint(endpoints[selectedEndpoint]);
  }, [endpoints, selectedEndpoint, setEndpoint]);

  return (
    <ContainerDiv containerWidth="lg">
      <div id="devcorner" className="column developers-corner-portlet">
        <div className="col-12">
          <div className="d-flex flex-wrap">
            <h3 className="w-100">{i18n.t("sparql.endpoint.headline")}</h3>
            <SelectEndpoint
              className="w-90 w-sm-25"
              value={selectedEndpoint}
              onChange={setSelectedEndpoint}
            />
            <EndpointInfo />
          </div>
        </div>

        <div className="col-12">
          <h3>{i18n.t("sparql.examples.headline")}</h3>
          <div className="filter-tags">
            {queryOptions.map(({ name, query, prefixes }) => (
              <button
                className="filter-tag interactive w-100 w-sm-auto justify-content-center mb-1 me-1"
                key={name}
                onClick={() => {
                  setQuery(query);
                  setPrefixes(prefixes);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="col-12">
          <h3>{i18n.t("sparql.prefixes.headline")}</h3>
          <div className="filter-tags">
            {Object.values(PREFIXES).map((prefix) => (
              <button
                className="filter-tag interactive mb-1 me-1"
                key={prefix.key}
                onClick={() => togglePrefix(prefix)}
              >
                {prefix.key}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between mb-4">
          <h3 className="w-100">{i18n.t("sparql.ergebnisformat.headline")}</h3>
          <SelectFormat
            className="w-100 w-sm-25"
            value={selectedFormat}
            onChange={setSelectedFormat}
          />
          <button
            id="executeQuery"
            className="button-search button-search-small query-execute w-100 w-sm-auto mt-2 mt-sm-0"
            onClick={execQuery}
          >
            {i18n.t("sparql.query.execute")}
          </button>
        </div>

        {renderContainer()}
      </div>
    </ContainerDiv>
  );
}
