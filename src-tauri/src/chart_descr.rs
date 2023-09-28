use log::info;
use serde::Serialize;


#[derive(Serialize)]
pub struct ProcessListItem {
    id: isize,
    name: String,
}
#[tauri::command]
pub fn get_process_list() -> Vec<ProcessListItem> {
    info!("BACKEND: Retrieve a process list.");    
    vec![
        ProcessListItem {
            id: 1,
            name: "Process X".to_string(),
        },
        ProcessListItem {
            id: 2,
            name: "Process Y".to_string(),
        },
        ProcessListItem {
            id: 2,
            name: "Call-path A".to_string(),
        },
    ]
}



#[derive(Serialize, Debug)]
pub struct ChartDataParameters {
    pub labels: Vec<String>,
    pub data: Vec<Vec<f64>>,
}

#[tauri::command]
pub fn get_process_data(name: &str, metric: &str) -> ChartDataParameters {
    info!("BACKEND: Retrieve data for process={name} and metric={metric}.");    
    let cdp = ChartDataParameters {
        labels: vec![
            "jan".to_string(),
            "febr".to_string(),
            "MaaRT".to_string(),
            "April".to_string(),
            "mEi".to_string(),
            "Juni".to_string(),
            "JulY".to_string(),
        ],
        data: vec![
            vec![65.0, 59.0, 80.0, 81.0, 56.0, 55.0, 40.0],
            vec![100.0, 20.0, 80.0, 75.0, 70.0, 75.0, 40.0],
        ],
    };

    cdp
}

