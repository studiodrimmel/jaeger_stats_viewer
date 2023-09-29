use log::{error, info};
use jaeger_stats::{self, ProcessListItem, ChartDataParameters, ChartLine};
use super::backend::STITCHED;
use serde::Serialize;

#[tauri::command]
pub fn get_process_list(metric: Option<&str>) -> Vec<ProcessListItem> {
    info!("BACKEND: get_process_list({metric:?})");
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

// export interface ChartData {
//     title: string;
//     metric?: string;
//     process?: string;
//     description: string[][];
//     labels: String[];
//     lines: ChartLine[]
// }

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
        ChartData { title: cdp.title, metric: Some(metric.to_string()), process: Some(process.to_string()), description: Vec::new(), labels: cdp.labels, lines: cdp.lines }
    }
}

//TODO: return value should be an Optional
#[tauri::command]
pub fn get_process_data(proc_oper: &str, metric: &str) -> ChartData {
    info!("BACKEND: get_process_data({proc_oper}, {metric})");    
    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(stitched) => ChartData::new(jaeger_stats::get_proc_oper_chart_data(&stitched, proc_oper, metric).unwrap(), proc_oper, metric),
        None => {
            panic!("Not stitched data loaded");
        }
    }
}

