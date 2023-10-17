use std::ops::DerefMut;

use super::backend::STITCHED;
use jaeger_stats::Selection;
use log::error;



#[tauri::command]
pub fn get_labeled_selection() -> Selection {

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
pub fn set_selection(selection: Vec<bool>) -> String {

    let mut guard = STITCHED.lock().unwrap();
    match &mut (guard.deref_mut()) {
        Some(sd) => match sd.set_selection(selection) {
            Ok(()) => "Ok".to_owned(),
            Err(err) => {
                error!("Setting selection failed with error: {err:?}");
                format!("Setting selection failed with error: {err:?}")
            }
        },
        None => {
            error!("No stitched data loaded");
            "No stitched data loaded".to_owned()
        }
    }
}
