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
import { DEFAULT_INBOUND_OPTION, RANKING_METRICS, RANKING_OPTIONS } from './dashboard.constants';
import { DashboardFilterbarComponent } from "./components/dashboard-filterbar/dashboard-filterbar.component";
import { DashboardService } from './dashboard.service';
import { LabeledSelection, Ranking } from 'src/app/types';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, forkJoin, map, Observable, of, skip, switchMap, tap } from 'rxjs';
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
  ],
  styles: [`
    .visualize-button {
      /* transform: rotate(-90deg) translateY(100%); */
    }

  `]
})
export class DashboardComponent implements OnInit {
  pageName = 'Process Info'
  breadcrumb: MenuItem[];

  // Ranking
  selectedRanking = RANKING_OPTIONS[0];

  // Processes
  processes$ = new BehaviorSubject<Process[]>([]);
  relatedProcessesses$ = new BehaviorSubject<Process[]>([]);

  filteredProcesses: Process[] = [];
  filteredRelatedProcesses: Process[] = [];

  // Charts
  chartsError: string | null = null;
  chartsRelatedError: string | null = null;

  dateFilterLabels$: Observable<LabeledSelection>;

  constructor(
    public _jaeger: JaegerDataService,
    public _dashboard: DashboardService
  ) {
    this.dateFilterLabels$ = _jaeger.getLabeledSelection();
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
    combineLatest([
      this._dashboard.selectedProcess$.pipe(
        tap(() => this._dashboard.clearRelatedProcess())
      ),
      this._dashboard.selectionItems$
    ]).pipe(
      distinctUntilChanged(),
      filter(([p]) => !!p),
      switchMap(([process]) => this.getChartsForProcess(process as Process))
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
      this._dashboard.selectedRanking$,
      this._dashboard.scope$,
      this._dashboard.inboundId$
    ]).pipe(
      distinctUntilChanged(),
      filter(([process, ranking]) => !!process && !!ranking),
      tap(([process, ranking]) => this.setInboundCallChainOptions(process as Process, ranking)),
      switchMap(([process, ranking, scope, inboundOption]) => {
        // in case we are selection an 'inbound' process the inboundIdx filter is ignored as we want to see all processes.
        const inboundFilter = scope === 'inbound' ? DEFAULT_INBOUND_OPTION.index : inboundOption.index;
        return this._jaeger.getCallChains(process!.key, ranking.value, scope, inboundFilter);
      }),
    ).subscribe(relatedProcesses => {
      this.relatedProcessesses$.next(relatedProcesses);
    });

    // Get charts for the related process
    combineLatest([
      this._dashboard.selectedRelatedProcess$,
      this._dashboard.scope$,
      this._dashboard.selectionItems$
    ]).pipe(
      distinctUntilChanged(),
      filter(([process]) => !!process),
      switchMap(([process, scope]) => this.getChartsForCallChain(process as Process, scope))
    ).subscribe({
      next: chartData => {
        this.chartsRelatedError = null;
        this._dashboard.relatedProcessesChartData$.next(chartData);
      },
      error: () => this.chartsRelatedError = 'Oops, couldn\'t get the call chains'
    });

    combineLatest([
      this._dashboard.minimumAvgCount$,
      this.processes$
    ]).subscribe(([min, processes]) => {
      this.filteredProcesses = processes.filter(p => p.avgCount >= min)
    });

    combineLatest([
      this._dashboard.minimumAvgCountCallChain$,
      this.relatedProcessesses$
    ]).subscribe(([min, processes]) => {
      this.filteredRelatedProcesses = processes.filter(p => p.avgCount >= min)
    });
  }

  private getAllProcesses(ranking: Ranking) {
    this._jaeger.getProcesses(ranking.value).subscribe(processes => {
      this.processes$.next(processes);

      this._dashboard.selectedProcess$.next(this._dashboard.selectedProcess$.value ?? processes[0]);
    })
  }

  private getChartsForProcess(process: Process) {
    const obs = RANKING_METRICS.map(metric => this._jaeger.getChartDataForProcess(process.key, metric));
    return forkJoin(obs);
  }

  private getChartsForCallChain(process: Process, scope: string) {
    const obs = RANKING_METRICS.map(metric => this._jaeger.getCallChainChartData(process.key, metric, scope));
    return forkJoin(obs);
  }

  private setInboundCallChainOptions(process: Process, ranking: Ranking) {
    this._jaeger.getCallChains(process!.key, ranking.value)
      .pipe(map(res => [DEFAULT_INBOUND_OPTION, ...res.map(r => (
        {
        index: r.idx.toString(),  // on the inbound record we need to take the idx, which is matched by the inboundIdx on end2end and full processes
        display: r.display
      }))]))
      .subscribe(res => this._dashboard.inboundOptions$.next(res));
  }

}
