use super::backend::STITCHED;
use jaeger_stats::{self, Table};
use log::{debug, error, info};
use serde::Serialize;

#[tauri::command]
pub fn get_file_stats() -> Option<Table> {
    info!("BACKEND: get_file_stats()");

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => Some(sd.get_file_stats()),
        None => {
            error!("No stitched data loaded");
            None
        }
    }
}
