export type ChartLine = {
    label: string;
    data: number[];
}

export interface ChartData {
    title: string;
    metric?: string;
    process?: string;
    description: string[][];
    labels: String[];
    lines: ChartLine[]
}

export interface MetricChartYAxis {
    metric: string;
    min: number;
    max: number;
}