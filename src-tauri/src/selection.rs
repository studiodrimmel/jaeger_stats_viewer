use std::ops::DerefMut;

use super::backend::STITCHED;
use jaeger_stats::Selection;
use log::error;


// pub struct Label {
//     pub idx: i64, // could be u64, but will be used in json, so will be signed anyway
//     pub label: String,
//     pub selected: bool,
// }

#[tauri::command]
pub fn get_selection() -> Selection {

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => {
            let res = sd.get_selection();
            res.iter().map(|x| (*x).clone()).collect()
        },
        None => {
            error!("Not stitched data loaded");
            Vec::new()
        }
    }
}

#[tauri::command]
pub fn set_selection(selection: Vec<bool>) {

    let mut guard = STITCHED.lock().unwrap();
    match &mut (guard.deref_mut()) {
        Some(sd) => match sd.set_selection(selection) {
            Ok(()) => (),
            Err(err) => {
                error!("Setting selection failed with error: {err:?}");
            }
        },
        None => {
            error!("Not stitched data loaded");
        }
    }
}
