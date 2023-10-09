import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Process } from 'src/app/types';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { SortChartsByRankingPipe } from "../../pipes/sort-charts-by-ranking.pipe";
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { RankingPercentagePipe } from '../../pipes/ranking-percentage.pipe';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';


@Component({
    selector: 'app-related-processes',
    standalone: true,
    templateUrl: './related-processes.component.html',
    imports: [
      CommonModule,
      FormsModule,
      ChartModule,
      ChipModule,
      PanelModule,
      AutoCompleteModule,
      DropdownModule,
      SelectButtonModule,
      SortChartsByRankingPipe,
      RankingPercentagePipe
    ]
})
export class RelatedProcessesComponent implements OnInit {
  @Input() processes: Process[]

  charts$: Observable<any[]>

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
    this.charts$ = combineLatest([
      this._dashboard.relatedProcessesChartData$.pipe(
        map(chartData => chartData.map(data => this._dashboard.buildChartDatasetFromChartData(data)))
      ),
      this._dashboard.processesYAxisValues$,
      this._dashboard.equalAxis$
    ]).pipe(
      distinctUntilChanged(),
      map(([chartData, yAxis, equalAxis]) => {
        if (!chartData?.length) {
          return [];
        }

        return chartData.map(cD => {
          const processYAxis = yAxis.find(yA => yA.metric === cD.metric)
        
          if (!processYAxis || !equalAxis) {
            return cD;
          }
          
          return {
            ...cD,
            options: {
              scales: {
                y: {
                  beginAtZero: processYAxis.min < 0 ? false : true,
                  max: processYAxis.max,
                  min: processYAxis.min < 0 ? processYAxis.min : undefined
                }
              }
            }
          }
        })
      })
    )
  }

  changeScope(event: SelectButtonChangeEvent) {
    this._dashboard.relatedProcessesChartData$.next([]);
    this._dashboard.selectedRelatedProcess$.next(null);
    this._dashboard.scope$.next(event.value);
  }
  
  changeProcess(process: Process) {
    console.log(process);
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
