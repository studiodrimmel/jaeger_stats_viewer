import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChartData, Process, Ranking } from '../../types';
import { RANKING_OPTIONS } from './dashboard.constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  selectedProcess$ = new Subject<Process>();
  selectedRanking$ = new BehaviorSubject<Ranking>(RANKING_OPTIONS[0]);
  chartData$ = new Subject<ChartData[]>();
}
