export type ChartLine = {
    label: string;
    data: number[];
}

export interface ChartData {
    title: string;
    description: string[][];
    labels: String[];
    lines: ChartLine[]
}