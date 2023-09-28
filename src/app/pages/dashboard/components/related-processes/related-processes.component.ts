import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Process } from 'src/app/types';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-related-processes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  templateUrl: './related-processes.component.html'
})
export class RelatedProcessesComponent {
  @Input() processes: Process[]

  // Processes
  selectedProcess: Process;
  filteredProcesses: Process[] = [];

  constructor(
    public _dashboard: DashboardService
  ) {}

  changeProcess(process: Process) {
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
