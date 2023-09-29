import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PageHeaderComponent } from '../../components/layout/page-header/page-header.component';
import {
  DashboardHeaderMetricsComponent
} from './components/dashboard-header-metrics/dashboard-header-metrics.component';
import { MenuItem } from 'primeng/api';
import { JaegerDataService } from '../../services/jaeger-data.service';
import { FormsModule } from '@angular/forms';
import { Process } from 'src/app/types/process.type';
import { RANKING_METRICS, RANKING_OPTIONS } from './dashboard.constants';
import { DashboardFilterbarComponent } from "./components/dashboard-filterbar/dashboard-filterbar.component";
import { DashboardService } from './dashboard.service';
import { Ranking } from 'src/app/types';
import { distinctUntilChanged, forkJoin, skip } from 'rxjs';
import { ProcessChartsComponent } from "./components/process-charts/process-charts.component";
import { RelatedProcessesComponent } from "./components/related-processes/related-processes.component";

@Component({
    standalone: true,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        PageHeaderComponent,
        DashboardHeaderMetricsComponent,
        DashboardFilterbarComponent,
        ProcessChartsComponent,
        RelatedProcessesComponent
    ]
})
export class DashboardComponent implements OnInit {
  pageName = 'Dashboard'
  breadcrumb: MenuItem[];

  // Ranking
  selectedRanking = RANKING_OPTIONS[0];

  // Processes
  processes: Process[] = [];
  selectedProcess: Process;

  // Charts
  chartsError: string | null = null;

  constructor(
    public _jaeger: JaegerDataService,
    public _dashboard: DashboardService
  ) {
    this.breadcrumb = [{ label: this.pageName }];
  }

  ngOnInit(): void {
    this.getAllProcesses();

    this._dashboard.selectedRanking$.pipe(
      skip(1),
      distinctUntilChanged(),
    ).subscribe((ranking) => {
      this.getAllProcesses(ranking);
    });

    this._dashboard.selectedProcess$.pipe(
      distinctUntilChanged()
    ).subscribe(process => this.getChartsForProcess(process))
  }

  private getAllProcesses(ranking?: Ranking) {
    this._jaeger.getProcesses(ranking).subscribe(processes => {
      this.processes = processes;
      this._dashboard.selectedProcess$.next(processes[0]);
    })
  }

  private getChartsForProcess(process: Process) {
    this.chartsError = null;
    const obs = RANKING_METRICS.map(metric => this._jaeger.getChartData(process.name, metric));

    // Get chart data for every metric
    forkJoin(obs).subscribe({
      next: chartData => this._dashboard.chartData$.next(chartData),
      error: () => this.chartsError = 'Oops, couldn\'t get the charts'
    });
  }
}
