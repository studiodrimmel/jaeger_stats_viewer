import { Injectable } from '@angular/core';
import { InvokeArgs } from '@tauri-apps/api/tauri';
import { from, map, Observable, tap } from 'rxjs';
import { ChartData, Ranking } from '../types';
import { invoke } from '@tauri-apps/api';
import { info } from 'tauri-plugin-log-api';
import { Graph } from '../types/graph.types';
import { Process } from '../types/process.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JaegerDataService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  getProcesses(ranking?: Ranking): Observable<Process[]> {
    return this._http.get<Process[]>('/assets/mock-data/proces_list_mock.json').pipe(
      map((processes: Process[]) => processes.sort((a, b) => 
        a.rank < b.rank ? 1 : (a.rank === b.rank ? 0 : -1)
      ))
    )
    // return from(invoke<Process[]>('process_list')).pipe(
    //     tap((graphs) => {
    //       info("Returned from RUST: process_list with:");
    //       info(String(graphs));
    //     })
    // );
  }

  getChartData(process: string, metric: string): Observable<ChartData> {
    return this._http.get<ChartData>('/assets/mock-data/charts_mock.json').pipe(
      map((chartData) => ({
        ...chartData,
        metric,
        process
      }))
    )
    // return from(invoke<ChartData>("get_process_data", { name: process, metric: metric })).pipe(
    //   tap((chdata) => info(String(chdata)))
    // );
  }
}
