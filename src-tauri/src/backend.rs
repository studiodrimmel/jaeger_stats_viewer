use jaeger_stats::Stitched;
use log::{error, info};
use std::{path::Path, sync::Mutex};

pub static STITCHED: Mutex<Option<Stitched>> = Mutex::new(None);

pub fn set_stitched_data(val: Stitched) {
    let mut guard = STITCHED.lock().unwrap();
    *guard = Some(val)
}

#[tauri::command]
pub fn load_stitch_data(file_name: &str) -> String {
    if Path::new(file_name).exists() {
        info!("Trying to load the file {file_name}");

        match Stitched::from_json(file_name) {
            Ok(data) => {
                info!("Ready loading file");
                set_stitched_data(data);
                "Ok".to_string()
            }
            Err(err) => {
                error!("loading {file_name} failed with error: {err:?}");
                format!("ERROR: {err:?}")
            }
        }
    } else {
        let msg = format!("ERROR: File '{file_name} does not exist");
        error!("{msg}");
        msg
    }
}
