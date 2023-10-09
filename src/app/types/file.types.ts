// or shoud I reuse the chartType from chart.types.ts
// export type ChartLine = {
//     label: string;
//     data: number[];
// }
import { ChartLine } from './chart.types';

export interface Table {
    columnLabels: string[];
    data: ChartLine[]
}