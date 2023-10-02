import { Injectable } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import { ChartData, Ranking, ChartLine } from '../types';
import { invoke } from '@tauri-apps/api';
import { debug, info } from 'tauri-plugin-log-api';
import { Process } from '../types';
import { HttpClient } from '@angular/common/http';


function buildChartData(title: string, process: string, metric: string, chline: ChartLine): ChartData {
  return {
    title: `title ${metric}`,
    metric: metric,
    process: process,
    description: [["param 1", "value"]],
    labels: ["1", "2", "3", "4", "5", "6", "zeven", "8", "9", "TEN"],
//    lines: [{label: "HELLO DATA", data: [1, 2, 3]}]
    lines: [chline]
  }
}

function checkChartData(chdata: ChartData): ChartData {
  info(`received  ${chdata}`);
  debug(`   title = ${chdata.title}`);
//  debug(`   label = ${chdata.label}`);
  return chdata
}

@Injectable({
  providedIn: 'root'
})
export class JaegerDataService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  getProcesses(ranking: Ranking): Observable<Process[]> {
    // return this._http.get<Process[]>('/assets/mock-data/proces_list_mock.json').pipe(
    //   map((processes: Process[]) => processes.sort((a, b) => 
    //     a.rank < b.rank ? 1 : (a.rank === b.rank ? 0 : -1)
    //   ))
    // )
    debug(`Calling get_process_list(${ranking.value})`);
    return from(invoke<Process[]>('get_process_list', {metric: ranking.value})).pipe(
        tap((graphs) => {
          info(`Returned from RUST: process_list with: lenght ${graphs.length}`);
        })
    );
  }

  getRelatedProcesses(processName: string, ranking: Ranking): Observable<Process[]> {
    // return this._http.get<Process[]>('/assets/mock-data/proces_list_mock.json').pipe(
    //   map((processes: Process[]) => processes.sort((a, b) => 
    //     a.rank < b.rank ? 1 : (a.rank === b.rank ? 0 : -1)
    //   ))
    // )
    debug(`Calling get_process_list(${ranking})`);
    return from(invoke<Process[]>('get_process_list', {metric: ranking.value})).pipe(
        tap((graphs) => {
          info(`Returned from RUST: process_list with: lenght ${graphs.length}`);
        })
    );
  }
  
  getChartData(process: string, metric: string): Observable<ChartData> {
      debug(`Calling get_process_data(${process}, ${metric})`);
    //   var res = this._http.get<ChartData>('/assets/mock-data/charts_mock.json').pipe(
    //       map((chartData) => ({
    //         ...chartData,
    //         metric,
    //         process
    //       }))
    // );
    // debug(`Mock results = ${res}`);
    // return res;
    return from(invoke<ChartData>("get_process_data", { procOper: process, metric: metric })).pipe(
      tap((chdata) => info(String(chdata)))
    );
 }

 getCallChainChartData(ccKey: string, metric: string): Observable<ChartData> {
  debug(`Calling get_call_chain_data(${ccKey}, ${metric})`);
  // "inbound" is the default Scope.   The other option "end2end" still needs to be implemented (not a big issue but did not have time yet)
  return from(invoke<ChartData>("get_call_chain_data", { ccKey: ccKey, metric: metric})).pipe(
    tap((chdata) => info(String(chdata)))
  );
}


}
