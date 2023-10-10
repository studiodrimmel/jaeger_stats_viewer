import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RANKING_OPTIONS } from '../../dashboard.constants';
import { DashboardService } from '../../dashboard.service';
import { Ranking } from 'src/app/types';

@Component({
  selector: 'app-dashboard-filterbar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    AutoCompleteModule,
    DropdownModule,
    FormsModule,
    SelectButtonModule,
    ToggleButtonModule,
  ],
  templateUrl: './dashboard-filterbar.component.html'
})
export class DashboardFilterbarComponent {
  // Rankings
  selectedRanking: Ranking;
  rankingOptions = RANKING_OPTIONS;

  // Equalize
  isEqualized = false;
  stateOptions: any[] = [{label: 'original y-axes', value: false}, {label: 'equal y-axes', value: true}];


  constructor(
    public _dashboard: DashboardService
  ) {
    this._dashboard.selectedRanking$.subscribe(ranking => this.selectedRanking = ranking);
  }

  changeRanking(ranking: Ranking) {
    this._dashboard.selectedRanking$.next(ranking);
  }

  changeEqualizer(isEqual: boolean) {
    this._dashboard.equalAxis$.next(isEqual);
  }
}
