import { AfterViewInit, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  DashboardHeaderMetricsComponent
} from './components/dashboard-header-metrics/dashboard-header-metrics.component';
import { MenuItem } from 'primeng/api';
import { JaegerDataService } from '../../services/jaeger-data.service';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable } from 'rxjs';
import { Graph } from '../../types/graph.types';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    PageHeaderComponent,
    DashboardHeaderMetricsComponent,
    ToolbarModule,
    AutoCompleteModule,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {
  breadcrumb: MenuItem[];
  graphs: Graph[] = [];

  items: any[] = [];
  selectedItem: any;
  suggestions: any[] = [];

  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }

  constructor(
      private _jaeger: JaegerDataService
  ) {
    this.breadcrumb = [{ label: 'Dashboard' }];

  }

  ngAfterViewInit() {
    this._jaeger.getGraphs().subscribe(graphs => {
      this.graphs = graphs;
    })
  }
}
