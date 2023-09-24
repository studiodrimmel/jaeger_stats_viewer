use serde::Serialize;
use log::{info, debug};

#[derive(Serialize)]
pub struct Dataset {
    pub label: String,
    pub data: Vec<f64>,
    pub fill: bool,
    pub tension: Option<f64>,
    #[serde(rename = "backgroundColor")]
    pub background_color: Option<Vec<String>>,
    #[serde(rename = "borderColor")]
    pub border_color: String,
    #[serde(rename = "borderWidth")]
    pub border_width: Option<f64>,
}

#[derive(Serialize)]
pub struct ChartData {
    pub labels: Vec<String>,
    pub datasets: Vec<Dataset>,
}

#[derive(Serialize)]
pub struct ChartScale {
    pub beginAtZero: bool
}

#[derive(Serialize)]
pub struct ChartScales {
    pub x: ChartScale,
    pub y: ChartScale
}

#[derive(Serialize)]
pub struct ChartOptions {
    scales: ChartScales
}

#[derive(Serialize)]
pub struct ChartDescr {
    #[serde(rename = "type")]
    pub type_rs: String,
    pub data: ChartData,
    pub options: Option<ChartOptions> 
}

#[tauri::command]
pub fn get_chart_descr(name: &str, metric: &str) -> ChartDescr {
    info!("RUST: Received call to get_chart_descr({name}, {metric})");


    info!("Received in get_chart_descr:  name={name} and metric={metric}");

    ChartDescr { 
        type_rs: "line".to_string(), 
        data: ChartData { 
            labels: vec!["jan".to_string(), "febr".to_string(), "MaaRT".to_string(), "April".to_string(), "mEi".to_string(), "Juni".to_string(), "JulY".to_string()], 
            datasets: vec![
                Dataset{
                    label: "My First Dataset".to_string(),
                    data: vec![65.0, 59.0, 80.0, 81.0, 56.0, 55.0, 40.0],
                    fill: false,
                    border_color: "rgb(75, 192, 192)".to_string(),
                    tension: Some(0.1),
                    background_color: None,
                    border_width: None
                  },
                  Dataset{
                    label: "2nd Dataset".to_string(),
                    data: vec![100.0, 90.0, 80.0, 75.0, 70.0, 75.0, 40.0],
                    fill: false,
                    border_color: "rgb(255, 0, 0)".to_string(),
                    tension: Some(0.1),
                    background_color: None,
                    border_width: None
                  },
            ] }, 
        options: None, 
    }
}
