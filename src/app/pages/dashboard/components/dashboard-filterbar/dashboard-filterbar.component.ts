import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RANKING_OPTIONS } from '../../dashboard.constants';
import { DashboardService } from '../../dashboard.service';
import { Equalizer, LabeledSelection, Ranking, SelectionItem } from 'src/app/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { JaegerDataService } from 'src/app/services/jaeger-data.service';

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
export class DashboardFilterbarComponent implements OnChanges {
  @Input() dateFilterLabels: LabeledSelection | undefined;

  // Rankings
  selectedRanking: Ranking;
  rankingOptions = RANKING_OPTIONS;

  // Equalize
  isEqualized = 'default';
  stateOptions: {label: string, value: Equalizer}[] = [{label: 'original y-axes', value: 'default'}, {label: 'equal y-axes', value: 'equal'}, {label: 'Start at zero', value: 'zero'}];

  selectedStartDate: SelectionItem | undefined;
  selectedEndDate: SelectionItem | undefined;

  constructor(
    public _dashboard: DashboardService,
    private readonly _jaeger: JaegerDataService
  ) {
    
    this._dashboard.selectedRanking$.pipe(takeUntilDestroyed()).subscribe(ranking => this.selectedRanking = ranking);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const labels = changes['dateFilterLabels'].currentValue;
    !!labels.length && this.setStartAndEndDate(labels);
  }

  changeRanking(ranking: Ranking) {
    this._dashboard.selectedRanking$.next(ranking);
  }

  changeEqualizer(isEqual: Equalizer) {
    this._dashboard.equalAxis$.next(isEqual);
  }

  updateDateSelection() {
    const dates = [...this.dateFilterLabels as LabeledSelection].map(option => ({ 
      ...option, 
      selected: this.isSelectedIdx(option.idx)
    }));
    this._jaeger.setSelection(dates.map(d => d.selected)).subscribe({
      next: () => {        
        this._dashboard.selectionItems$.next(dates);
      }
    });
  }

  private isSelectedIdx(idx: number) {
    return (idx >= this.selectedStartDate!.idx && idx <= this.selectedEndDate!.idx) ?? false
  }

  private setStartAndEndDate(labels: LabeledSelection) {
    this.selectedStartDate = labels[0];
    this.selectedEndDate = labels[labels.length - 1];
  }
}
