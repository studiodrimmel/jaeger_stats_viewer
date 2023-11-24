import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { ChartData, Ranking } from '../types';
import { invoke } from '@tauri-apps/api';
import { debug, info } from 'tauri-plugin-log-api';
import { Process } from '../types';
import { FileStats } from '../types';
import { Selection, LabeledSelection} from '../types';
import { DEFAULT_INBOUND_OPTION, DEFAULT_SCOPE } from '../pages/dashboard/dashboard.constants';

@Injectable({
  providedIn: 'root'
})
export class JaegerDataService {

  getFileStats(): Observable<FileStats> {
    debug(`Calling get_file_stats()`);
    return from(invoke<FileStats>('get_file_stats', {  })).pipe(
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

  getCallChains(procOper: string, metric: string, scope: string = DEFAULT_SCOPE, inboundIdx = DEFAULT_INBOUND_OPTION.index): Observable<Process[]> {
    debug(`Calling get_call_chain_list(${procOper}, ${metric}, ${scope}, ${inboundIdx})`);
    return from(invoke<Process[]>('get_call_chain_list', {
      procOper,
      metric,
      scope,
      inboundIdx
    })).pipe(
      tap((graphs) => {
        info(`Returned from RUST: ${graphs.length} items for get_call_chain_list(${procOper}, ${metric}, ${scope})`);
        debug(`   first item has chainType ${graphs[0].chainType}`);
        debug(`   first item has inboundIdx ${graphs[0].inboundIdx}`);
      }),
      catchError(() => [])
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

  getLabeledSelection(): Observable<LabeledSelection> {
    debug(`Calling get_labeled_selection()`);

    return from(invoke<LabeledSelection>('get_labeled_selection', { })).pipe(
      tap((labeledSel) => {
        info(`Returned from RUST: labeled_selection with: lenght ${labeledSel.length}`);
      })
    );
  }


  setSelection(selection: boolean[]): Observable<string> {
    debug(`Calling set_selection()`);
    return from(invoke<string>('set_selection', { selection })).pipe(
      tap((result) => {
        info(`Returned from RUST: result ${result}`);
      })
    );
  }

  getMermaidDiagram(procOper: string, callChainKey: string | null, scope: string, compact: boolean): Observable<string> {
    debug(`Calling get_mermaid(${procOper}, ${callChainKey}, ${scope}, ${compact})`);
    return from(invoke<string>("get_mermaid", {
      procOper,
      callChainKey,
      scope,
      compact
    })).pipe(
      tap((diagramSpec) => info(String(diagramSpec)))
    );
  }


}
