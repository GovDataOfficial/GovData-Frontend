"use client";

import { useEffect, useRef, useState } from "react";
import { ChartJsData } from "@/app/metadatenqualitaet/_components/Charts/types";
import { useSearchParams } from "next/navigation";
import { ChartJSDataTable } from "@/app/metadatenqualitaet/_components/Charts/ChartJSDataTable";

type Chart = {
  data: ChartJsData;
  ariaLabel: string;
};

export function Chart({ data, ariaLabel }: Chart) {
  const [ChartJS, setChartJS] = useState<any>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const searchParams = useSearchParams();
  const publisher = searchParams.get("publisher") || undefined;

  useEffect(() => {
    // @ts-ignore
    import("chart.js").then(({ default: defaultChartJS }) => {
      setChartJS(() => defaultChartJS);
    });
  }, []);

  useEffect(() => {
    if (canvasRef.current && ChartJS) {
      const chart = new ChartJS(canvasRef.current, data);
      return () => chart.destroy();
    }
  }, [data, publisher, ChartJS]);

  return (
    <>
      <canvas role="img" aria-label={ariaLabel} ref={canvasRef}>
        <ChartJSDataTable chartJsData={data} header={ariaLabel} />
      </canvas>
    </>
  );
}
