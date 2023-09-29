import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChartData, Process, Ranking } from '../../types';
import { RANKING_OPTIONS } from './dashboard.constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Ranking
  selectedRanking$ = new BehaviorSubject<Ranking>(RANKING_OPTIONS[0]);
  
  // Processes (left side)
  selectedProcess$ = new Subject<Process>();
  chartData$ = new Subject<ChartData[]>();

  // Related processes (right side)
  selectedRelatedProcess$ = new Subject<Process | null>();
  relatedProcessesChartData$ = new Subject<ChartData[]>();

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
      title: title,
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
}
