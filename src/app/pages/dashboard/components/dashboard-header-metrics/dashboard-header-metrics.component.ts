import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-header-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header-metrics.component.html'
})
export class DashboardHeaderMetricsComponent {
  @Input() numberOfProcesses: number;
  @Input() numberOfRelatedProcesses: number;
}
