use log::{debug, error, info};
use jaeger_stats::{self, ProcessListItem, ChartDataParameters, ChartLine as ChartLine_opt};
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



// #[tauri::command]
// pub fn tmp_get_process_data(proc_oper: &str, metric: &str) -> ChartDataParameters {
// //    let proc_oper = "bspc-spaarpotbeheer/batchCreateSpaarpotten";
// //    let proc_oper = "retail-gateway/GET:/services/apix-mijn-rekening/api/rekeningen/null/transacties";
// //    let metric = "p90_millis";

//     info!("#####   BACKEND: tmp_get_process_data({proc_oper}, {metric})");    
//     let guard = STITCHED.lock().unwrap();
//     match &*guard {
//         Some(stitched) => {
//             let full = jaeger_stats::get_proc_oper_chart_data(&stitched, &proc_oper, metric).unwrap();
//             //ChartLine::new(&full.lines[0])
//             debug!(" received: {full:?}");
//             full
//         },
//         None => {
//             error!("No stitched data loaded");
//             panic!("No stitched data loaded");
//         }
//     }
// }


// #[tauri::command]
// pub fn tmp_get_process_data(proc_oper: &str, metric: &str) -> String {
//     info!("#####   BACKEND: tmp_get_process_data({proc_oper}, {metric})");    
//     let guard = STITCHED.lock().unwrap();
//     match &*guard {
//         Some(stitched) => {
//             let full = jaeger_stats::get_proc_oper_chart_data(&stitched, proc_oper, metric).unwrap();
//             //ChartLine::new(&full.lines[0])
//             full.title
//         },
//         None => {
//             error!("No stitched data loaded");
//             panic!("No stitched data loaded");
//         }
//     }
// }
