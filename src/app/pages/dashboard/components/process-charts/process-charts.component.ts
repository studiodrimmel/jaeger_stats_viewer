import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { DashboardService } from '../../dashboard.service';
import { Process } from 'src/app/types';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { SortChartsByRankingPipe } from '../../pipes/sort-charts-by-ranking.pipe';
import { RankingPercentagePipe } from '../../pipes/ranking-percentage.pipe';

@Component({
  selector: 'app-process-charts',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    PanelModule,
    AutoCompleteModule,
    FormsModule,
    SortChartsByRankingPipe,
    RankingPercentagePipe
  ],
  templateUrl: './process-charts.component.html'
})
export class ProcessChartsComponent implements OnInit {

  @Input() processes: Process[]

  charts$: Observable<any[]>

  // Processes
  selectedProcess: Process;
  filteredProcesses: Process[] = [];

  constructor(
    public _dashboard: DashboardService
  ) {
    this._dashboard.selectedProcess$.subscribe(process => this.selectedProcess = process);
  }

  ngOnInit(): void {
    this.charts$ = combineLatest([
      this._dashboard.chartData$.pipe(
        map(chartData => chartData.map(data => this._dashboard.buildChartDatasetFromChartData(data)))
      ),
      this._dashboard.equalAxis$
    ]).pipe(
      distinctUntilChanged(),
      map(([chartData, equalAxis]) => {
        if (!chartData?.length) {
          return [];
        }

        return chartData.map(cD => {
          if (!equalAxis) {
            return cD;
          }
          
          return {
            ...cD,
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          }
        })
      })
    )
  }

  changeProcess(process: Process) {
    this._dashboard.selectedProcess$.next(process);
  }

  filterProcess(event: AutoCompleteCompleteEvent) {
    let filtered: Process[] = [];
    let query = event.query;

    for (let i = 0; i < this.processes.length; i++) {
      let process = this.processes[i];
      if (process.display.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(process);
      }
    }

    this.filteredProcesses = filtered;
  }

  processChartPlugin(metric: string) {
    return {
      afterDatasetDraw: (chart: any, args: any, options: any) => {
        const { max, min } = chart.scales.y;
        this._dashboard.updateProcessesYAxisValues({
          min, 
          max,
          metric
        });
      }
    }
  }
}
