import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChartData, Equalizer, InboundOption, LabeledSelection, MetricChartYAxis, Process, Ranking } from '../../types';
import { DEFAULT_INBOUND_OPTION, DEFAULT_SCOPE, RANKING_OPTIONS } from './dashboard.constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Ranking
  selectedRanking$ = new BehaviorSubject<Ranking>(RANKING_OPTIONS[0]);
  
  // Processes (left side)
  selectedProcess$ = new BehaviorSubject<Process | null>(null);
  chartData$ = new BehaviorSubject<ChartData[]>([]);

  // Related processes (right side)
  selectedRelatedProcess$ = new BehaviorSubject<Process | null>(null);
  relatedProcessesChartData$ = new Subject<ChartData[]>();
  scope$ = new BehaviorSubject<'inbound' | 'end2end' | 'all'>(DEFAULT_SCOPE);

  // yAxis
  equalAxis$ = new BehaviorSubject<Equalizer>('default');
  processesYAxisValues$ = new BehaviorSubject<MetricChartYAxis[]>([]);

  // AvgCount filter
  minimumAvgCount$ = new BehaviorSubject<number>(0);
  minimumAvgCountCallChain$ = new BehaviorSubject<number>(0);

  // Inbounds
  inboundId$ = new BehaviorSubject<InboundOption>(DEFAULT_INBOUND_OPTION);
  inboundOptions$ = new BehaviorSubject<InboundOption[]>([]);

  // SelectionItem
  selectionItems$ = new BehaviorSubject<LabeledSelection>([]);

  getChartPanelHeader(metric: string) {
    return RANKING_OPTIONS.find(opt => opt.value === metric)?.label;
  }

  clearRelatedProcess() {
    this.selectedRelatedProcess$.next(null);
    this.relatedProcessesChartData$.next([])
  }

  buildChartDatasetFromChartData(chartData: ChartData): any {
    const { title, description, metric, process, labels, lines } = chartData;
    return {
      title,
      description,
      metric,
      process,
      data: {
        labels: labels,
        datasets: lines.map(line => ({
          ...line,
          tension: 0.5,
          fill: false
        }))
      }
    }
  }

  updateProcessesYAxisValues(value: MetricChartYAxis) {
    const currentValues = this.processesYAxisValues$.getValue();
    const metric = currentValues.find(v => v.metric === value.metric);

    if (!metric) {
      this.processesYAxisValues$.next(currentValues.concat([value]));
    } else {
      this.processesYAxisValues$.next(
        currentValues.map(v => v.metric === value.metric ? value : v)
      );
    }
  }
}
