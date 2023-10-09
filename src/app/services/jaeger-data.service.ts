import { Injectable } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import { ChartData, Ranking } from '../types';
import { invoke } from '@tauri-apps/api';
import { debug, info } from 'tauri-plugin-log-api';
import { Process } from '../types';
import { Table } from '../types';
import { DEFAULT_SCOPE } from '../pages/dashboard/dashboard.constants';

@Injectable({
  providedIn: 'root'
})
export class JaegerDataService {

  getFileStats(): Observable<Table> {
    debug(`Calling get_file_stats()`);
    return from(invoke<Table>('get_file_stats', {  })).pipe(
      tap((tbl) => {
        info(`Returned from RUST: returns ${tbl}`);
      })
    );
  }


  getProcesses(metric: string): Observable<Process[]> {
    debug(`Calling get_process_list(${metric})`);
    return from(invoke<Process[]>('get_process_list', { metric })).pipe(
      tap((graphs) => {
        info(`Returned from RUST: process_list with: lenght ${graphs.length}`);
      })
    );
  }

  getCallChains(procOper: string, metric: string, scope: string = DEFAULT_SCOPE): Observable<Process[]> {
    debug(`Calling get_call_chain_list(${procOper}, ${metric}, ${scope})`);
    return from(invoke<Process[]>('get_call_chain_list', {
      procOper,
      metric,
      scope
    })).pipe(
      tap((graphs) => {
        info(`Returned from RUST: process_list with: lenght ${graphs.length}`);
        debug(`   first item has chainType ${graphs[0].chainType}`);
        debug(`   first item has inboundIdx ${graphs[0].inboundIdx}`);
      })
    );
  }

  getChartDataForProcess(procOper: string, metric: string): Observable<ChartData> {
    debug(`Calling get_process_data(${procOper}, ${metric})`);
    return from(invoke<ChartData>("get_process_data", {
      procOper,
      metric
    })).pipe(
      tap((chdata) => info(String(chdata)))
    );
  }

  getCallChainChartData(ccKey: string, metric: string, scope = DEFAULT_SCOPE): Observable<ChartData> {
    debug(`Calling get_call_chain_data(${ccKey}, ${metric})`);
    // "inbound" is the default Scope.   The other option "end2end" still needs to be implemented (not a big issue but did not have time yet)
    return from(invoke<ChartData>("get_call_chain_data", { 
      ccKey, 
      metric 
    })).pipe(
      tap((chdata) => info(String(chdata)))
    );
  }
}
