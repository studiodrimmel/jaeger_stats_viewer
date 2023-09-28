import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { DashboardService } from '../../dashboard.service';
import { ChartData, Process } from 'src/app/types';
import { map, Observable } from 'rxjs';
import { RANKING_OPTIONS } from '../../dashboard.constants';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-process-charts',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    PanelModule,
    AutoCompleteModule,
    FormsModule
  ],
  templateUrl: './process-charts.component.html'
})
export class ProcessChartsComponent implements OnInit {

  @Input() processes: Process[]

  charts$: Observable<any>

  // Processes
  selectedProcess: Process;
  filteredProcesses: Process[] = [];

  constructor(
    public _dashboard: DashboardService
  ) {
    this._dashboard.selectedProcess$.subscribe(process => this.selectedProcess = process);
  }

  ngOnInit(): void {
    this.charts$ = this._dashboard.chartData$.pipe(
      map(chartData => chartData.map(data => this.buildChartData(data)))
    );
  }

  getChartPanelHeader(metric: string) {
    return RANKING_OPTIONS.find(opt => opt.value === metric)?.label;
  }

  changeProcess(process: Process) {
    this._dashboard.selectedProcess$.next(process);
  }

  filterProcess(event: AutoCompleteCompleteEvent) {
    let filtered: Process[] = [];
    let query = event.query;

    for (let i = 0; i < this.processes.length; i++) {
      let process = this.processes[i];
      if (process.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(process);
      }
    }

    this.filteredProcesses = filtered;
  }
  
  private buildChartData(chartData: ChartData): any {
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
