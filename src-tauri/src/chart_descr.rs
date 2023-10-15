use super::backend::STITCHED;
use jaeger_stats::{self, ChartDataParameters, ChartLine as ChartLine_opt, ProcessListItem};
use log::{debug, error, info};
use serde::Serialize;
use std::env;

/// get the current work-directory as a string
fn get_current_working_dir() -> String {
    env::current_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .unwrap()
}

#[tauri::command]
pub fn get_process_list(metric: Option<&str>) -> Vec<ProcessListItem> {
    info!("BACKEND: get_process_list({metric:?})");
    info!(
        "BACKEND: Working directory: '{}'",
        get_current_working_dir()
    );
    let metric = metric.unwrap_or("rate (avg)");

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => sd.get_process_list(metric),
        None => {
            error!("Not stitched data loaded");
            Vec::new()
        }
    }
}

#[tauri::command]
pub fn get_call_chain_list(
    proc_oper: &str,
    metric: Option<&str>,
    scope: Option<&str>,
    inbound_idx: &str,
) -> Vec<ProcessListItem> {
    info!("BACKEND: get_process_list({metric:?})");
    info!(
        "BACKEND: Working directory: '{}'",
        get_current_working_dir()
    );
    let metric = metric.unwrap_or("rate (avg)");
    let scope = scope.unwrap_or("inbound");
    let inbound_idx = if inbound_idx != "*" {
        Some(inbound_idx.parse::<i64>().unwrap_or_else(|err| {
            panic!("inbound_idx='{inbound_idx}' could not be parsed as integer. (Error: {err})")
        }))
    } else {
        None
    };

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => {
            sd.get_call_chain_list(proc_oper, metric, scope, inbound_idx)
        }
        None => {
            error!("Not stitched data loaded");
            Vec::new()
        }
    }
}

#[derive(Serialize, Debug)]
pub struct ChartLine {
    pub label: String,
    pub data: Vec<Option<f64>>,
}

impl ChartLine {
    pub fn new(cl: &ChartLine_opt) -> Self {
        let data = cl.data.iter().map(|val| val.to_owned()).collect();
        Self {
            label: cl.label.to_owned(),
            data,
        }
    }
}

#[derive(Serialize, Debug)]
pub struct ChartData {
    pub title: String,
    pub metric: Option<String>,
    pub process: Option<String>,
    pub description: Vec<Vec<String>>,
    pub labels: Vec<String>,
    pub lines: Vec<ChartLine>,
}

impl ChartData {
    pub fn new(cdp: ChartDataParameters, process: &str, metric: &str) -> Self {
        let lines = cdp.lines.iter().map(|line| ChartLine::new(line)).collect();
        let description = cdp
            .description
            .into_iter()
            .map(|kv| vec![kv.0, kv.1])
            .collect();
        ChartData {
            title: cdp.title,
            metric: Some(metric.to_string()),
            process: Some(process.to_string()),
            description,
            labels: cdp.labels,
            lines,
        }
    }
}

//TODO: return value should be an Optional
#[tauri::command]
pub fn get_process_data(proc_oper: &str, metric: &str) -> ChartData {
    info!("#####   BACKEND: get_process_data({proc_oper}, {metric})");
    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => ChartData::new(
            sd.get_proc_oper_chart_data(proc_oper, metric).unwrap(),
            proc_oper,
            metric,
        ),
        None => {
            error!("No stitched data loaded");
            panic!("No stitched data loaded");
        }
    }
}

//TODO: return value should be an Optional
#[tauri::command]
pub fn get_call_chain_data(cc_key: &str, metric: &str) -> ChartData {
    info!("#####   BACKEND: get_call_chain_data({cc_key}, {metric})");

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => {
            match sd.get_call_chain_chart_data(cc_key, metric) {
                Some(ccd) => {
                    info!("Chart data has description {:?}", ccd.description);
                    ChartData::new(ccd, cc_key, metric)
                }
                None => {
                    error!("Failed to retrieve {cc_key}");
                    panic!("Failed to retrieve {cc_key}");
                }
            }
        }
        None => {
            error!("No stitched data loaded");
            panic!("No stitched data loaded");
        }
    }
}
