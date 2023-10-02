use log::{debug, error, info};
use jaeger_stats::{self, ProcessListItem, ChartDataParameters, ChartLine as ChartLine_opt};
use super::backend::STITCHED;
use serde::Serialize;
use std::env;


/// get the current work-directory as a string
fn get_current_working_dir() -> String {
    env::current_dir().unwrap().into_os_string().into_string().unwrap()
}


#[tauri::command]
pub fn get_process_list(metric: Option<&str>) -> Vec<ProcessListItem> {
    info!("BACKEND: get_process_list({metric:?})");
    info!("BACKEND: Working directory: '{}'", get_current_working_dir());
    let metric = metric.unwrap_or("rate (avg)");

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(stitched) => jaeger_stats::get_process_list(&stitched, metric),
        None => {
            error!("Not stitched data loaded");
            Vec::new()
        }
    }
}

#[tauri::command]
pub fn get_call_chain_list(proc_oper: &str, metric: Option<&str>, scope: Option<&str>) -> Vec<ProcessListItem> {
    info!("BACKEND: get_process_list({metric:?})");
    info!("BACKEND: Working directory: '{}'", get_current_working_dir());
    let metric = metric.unwrap_or("rate (avg)");
    let scope = scope.unwrap_or("inbound");

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(stitched) => jaeger_stats::get_call_chain_list(&stitched, proc_oper, metric, scope),
        None => {
            error!("Not stitched data loaded");
            Vec::new()
        }
    }
}

#[derive(Serialize, Debug)]
pub struct ChartLine {
    pub label: String,
    pub data: Vec<f64>,
}

impl ChartLine {
    pub fn new(cl: &ChartLine_opt) -> Self {
        let data = cl.data.iter().map(|val| val.unwrap_or(0.0)).collect();
        Self { label: cl.label.to_owned(), data }
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
        ChartData { title: cdp.title, metric: Some(metric.to_string()), process: Some(process.to_string()), description: Vec::new(), labels: cdp.labels, lines }
    }
}

//TODO: return value should be an Optional
#[tauri::command]
pub fn get_process_data(proc_oper: &str, metric: &str) -> ChartData {
    info!("#####   BACKEND: get_process_data({proc_oper}, {metric})");    
    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(stitched) => ChartData::new(jaeger_stats::get_proc_oper_chart_data(&stitched, proc_oper, metric).unwrap(), proc_oper, metric),
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
        Some(stitched) => ChartData::new(jaeger_stats::get_call_chain_chart_data(&stitched, cc_key, metric).unwrap(),cc_key, metric),
        None => {
            error!("No stitched data loaded");
            panic!("No stitched data loaded");
        }
    }
}
