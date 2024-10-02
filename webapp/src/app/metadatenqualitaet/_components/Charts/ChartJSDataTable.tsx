import { ChartJsData } from "@/app/metadatenqualitaet/_components/Charts/types";

type ChartJSDataTable = { chartJsData: ChartJsData; header: string };

export function ChartJSDataTable({ chartJsData, header }: ChartJSDataTable) {
  if (!chartJsData || !chartJsData?.data) {
    return null;
  }

  const labels = chartJsData.data.labels || [];
  const datasets = chartJsData.data.datasets || [];

  return (
    <table className="gd-charts-table">
      <thead>
        <tr>
          <th>{header}</th>
          {labels.map((label: string, index: number) => (
            <th key={`label_${index}`}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {datasets.map((dataset: any, index: number) => (
          <tr key={`dataset_${index}`}>
            <td>{dataset.label}</td>
            {dataset.data?.map((item: string, index: number) => (
              <td key={`data_${index}_${index}`}>{item}%</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
