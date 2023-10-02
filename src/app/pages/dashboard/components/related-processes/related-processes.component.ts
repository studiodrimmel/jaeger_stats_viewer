import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Process } from 'src/app/types';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { map, Observable } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { SortChartsByRankingPipe } from "../../pipes/sort-charts-by-ranking.pipe";
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { RankingPercentagePipe } from '../../pipes/ranking-percentage.pipe';

@Component({
    selector: 'app-related-processes',
    standalone: true,
    templateUrl: './related-processes.component.html',
    imports: [
      CommonModule,
      FormsModule,
      ChartModule,
      PanelModule,
      AutoCompleteModule,
      SelectButtonModule,
      SortChartsByRankingPipe,
      RankingPercentagePipe
    ]
})
export class RelatedProcessesComponent implements OnInit {
  @Input() processes: Process[]

  charts$: Observable<any>

  // Processes
  selectedRelatedProcess: Process | null;
  filteredRelatedProcesses: Process[] = [];

  // Scope
  selectedScope = 'inbound';
  scopes = ['inbound', 'end2end']

  constructor(
    public _dashboard: DashboardService
  ) {
    this._dashboard.selectedRelatedProcess$.subscribe(process => this.selectedRelatedProcess = process);
  }

  ngOnInit(): void {
    this.charts$ = this._dashboard.relatedProcessesChartData$.pipe(
      map(chartData => chartData.map(data => this._dashboard.buildChartDatasetFromChartData(data)))
    );
  }

  changeScope(event: SelectButtonChangeEvent) {
    this._dashboard.scope$.next(event.value);
  }

  changeProcess(process: Process) {
    this._dashboard.selectedRelatedProcess$.next(process);
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

    this.filteredRelatedProcesses = filtered;
  }
}
