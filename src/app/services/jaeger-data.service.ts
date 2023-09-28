import { Injectable } from '@angular/core';
import { InvokeArgs } from '@tauri-apps/api/tauri';
import { from, Observable, tap } from 'rxjs';
import { ChartData } from '../types';
import { invoke } from '@tauri-apps/api';
import { info } from 'tauri-plugin-log-api';
import { Graph } from '../types/graph.types';

@Injectable({
  providedIn: 'root'
})
export class JaegerDataService {

  constructor() { }

  getGraphs(): Observable<Graph[]> {
    return from(invoke<Graph[]>('get_graphs')).pipe(
        tap((graphs) => {
          info("Returned from RUST: get_graphs  with:");
          info(String(graphs));
        })
    );
  }
  
  getChartData(cmd: string, args?: InvokeArgs): Observable<ChartData> {
    return from(invoke<ChartData>(cmd, args)).pipe(
        tap((chdata) => info(String(chdata)))
    );
  }
}
