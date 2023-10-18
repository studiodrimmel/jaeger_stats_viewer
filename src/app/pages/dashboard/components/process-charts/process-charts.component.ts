import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { DashboardService } from '../../dashboard.service';
import { Process } from 'src/app/types';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { SortChartsByRankingPipe } from '../../pipes/sort-charts-by-ranking.pipe';
import { RankingPercentagePipe } from '../../pipes/ranking-percentage.pipe';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-process-charts',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    PanelModule,
    AutoCompleteModule,
    ChipModule,
    FormsModule,
    SortChartsByRankingPipe,
    RankingPercentagePipe,
    InputNumberModule
  ],
  templateUrl: './process-charts.component.html'
})
export class ProcessChartsComponent implements OnInit {

  @Input() processes: Process[]

  charts$: Observable<any[]>

  // Processes
  selectedProcess: Process;
  filteredProcesses: Process[] = [];

  // Avg count
  avgCount: number = 0;

  constructor(
    public _dashboard: DashboardService
  ) {
    this._dashboard.minimumAvgCount$.subscribe(count => this.avgCount = count);
    this._dashboard.selectedProcess$.subscribe(process => {
      if (process) {
        this.selectedProcess = process
      }
    });
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
          if (equalAxis === 'default') {
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

  changeAvgCount(count: number) {
    this._dashboard.minimumAvgCount$.next(count);
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
      afterLayout: (chart: any) => {
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
