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
import { combineLatest, distinctUntilChanged, filter, forkJoin, skip, switchMap, tap } from 'rxjs';
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
  relatedProcesses: Process[] = [];

  // Charts
  chartsError: string | null = null;
  chartsRelatedError: string | null = null;

  constructor(
    public _jaeger: JaegerDataService,
    public _dashboard: DashboardService
  ) {
    this.breadcrumb = [{ label: this.pageName }];
  }

  ngOnInit(): void {
    // Get all processes when the ranking changes
    this._dashboard.selectedRanking$.pipe(
      distinctUntilChanged(),
    ).subscribe((ranking) => {
      this.getAllProcesses(ranking);
    });

    // Get charts for the main process
    this._dashboard.selectedProcess$.pipe(
      distinctUntilChanged(),
      tap(() => this._dashboard.clearRelatedProcess()),
      switchMap((process) => this.getChartsForProcess(process))
    ).subscribe({
      next: chartData => {
        this.chartsError = null;
        this._dashboard.chartData$.next(chartData);
      },
      error: () => this.chartsError = 'Oops, couldn\'t get the charts'
    });

    // Get related processes when the main process or the ranking changes
    combineLatest([
      this._dashboard.selectedProcess$,
      this._dashboard.selectedRanking$
    ]).pipe(
      distinctUntilChanged(),
      filter(([process, ranking]) => !!process && !!ranking),
      switchMap(([process, ranking]) => this._jaeger.getRelatedProcesses(process.name, ranking)),
    ).subscribe(relatedProcesses => {
      this.relatedProcesses = relatedProcesses;
    });

    // Get charts for the related process
    this._dashboard.selectedRelatedProcess$.pipe(
      distinctUntilChanged(),
      filter(process => !!process),
      switchMap((process) => this.getChartsForProcess(process as Process))
    ).subscribe({
      next: chartData => {
        this.chartsRelatedError = null;
        this._dashboard.relatedProcessesChartData$.next(chartData);
      },
      error: () => this.chartsRelatedError = 'Oops, couldn\'t get the related charts'
    });
  }

  private getAllProcesses(ranking: Ranking) {
    this._jaeger.getProcesses(ranking).subscribe(processes => {
      this.processes = processes;
      this._dashboard.selectedProcess$.next(processes[0]);
    })
  }

  private getChartsForProcess(process: Process) {
    const obs = RANKING_METRICS.map(metric => this._jaeger.getChartData(process.name, metric));
    return forkJoin(obs);
  }
}
