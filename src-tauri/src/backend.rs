use jaeger_stats::StitchedDataSet;
use log::error;
use std::sync::Mutex;

pub static STITCHED: Mutex<Option<StitchedDataSet>> = Mutex::new(None);

pub fn set_stitched_data(val: StitchedDataSet) {
    let mut guard = STITCHED.lock().unwrap();
    *guard = Some(val)
}

#[tauri::command]
pub fn load_stitch_data(file_name: &str) -> String {
    match StitchedDataSet::from_file(file_name) {
        Ok(ds) => {
            set_stitched_data(ds);
            "ok".to_string()
        },
        Err(err) => {
            error!("loading {file_name} failed with error: {err:?}");
            format!("ERROR: {err:?}")
        }
    }
}
