import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RANKING_OPTIONS } from '../../dashboard.constants';
import { Process } from 'src/app/types/process.type';
import { DashboardService } from '../../dashboard.service';
import { Ranking } from 'src/app/types';

@Component({
  selector: 'app-dashboard-filterbar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    AutoCompleteModule,
    FormsModule,
    SelectButtonModule,

  ],
  templateUrl: './dashboard-filterbar.component.html'
})
export class DashboardFilterbarComponent {
  @Input()
  processes: Process[] = [];

  // Rankings
  selectedRanking: Ranking;
  rankingOptions = RANKING_OPTIONS;

  // Processes
  selectedProcess: Process;
  filteredProcesses: Process[] = [];

  constructor(
    public _dashboard: DashboardService
  ) {
    this._dashboard.selectedProcess$.subscribe(process => this.selectedProcess = process);
    this._dashboard.selectedRanking$.subscribe(ranking => this.selectedRanking = ranking);
  }

  changeRanking(ranking: Ranking) {
    this._dashboard.selectedRanking$.next(ranking);
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
}
