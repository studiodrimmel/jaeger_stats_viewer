use log::{debug, error, info};
use jaeger_stats::{self, Table};
use super::backend::STITCHED;
use serde::Serialize;


#[tauri::command]
pub fn get_file_stats() -> Option<Table> {
    info!("BACKEND: get_file_stats()");

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(stitched) => Some(jaeger_stats::get_file_stats(&stitched)),
        None => {
            error!("No stitched data loaded");
            None
        }
    }
}
