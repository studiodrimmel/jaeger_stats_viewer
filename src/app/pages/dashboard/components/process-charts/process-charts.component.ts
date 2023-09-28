import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../dashboard.service';
import { ChartData } from 'src/app/types';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-process-charts',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule
  ],
  templateUrl: './process-charts.component.html'
})
export class ProcessChartsComponent implements OnInit {

  charts$: Observable<any>

  constructor(
    public _dashboard: DashboardService
  ) {}

  ngOnInit(): void {
    this.charts$ = this._dashboard.chartData$.pipe(
      map(chartData => chartData.map(data => this.buildChartData(data)))
    );
  }
  
  private buildChartData(chartData: ChartData) {
    return {
      title: chartData.title,
      data: {
        labels: chartData.labels,
        datasets: chartData.lines.map(line => ({
          ...line,
          tension: 0.5,
          fill: false
        }))
      }
    }
  }
}
