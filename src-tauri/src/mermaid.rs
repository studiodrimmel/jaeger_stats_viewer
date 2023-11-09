use super::backend::STITCHED;
use log::error;



#[tauri::command]
pub fn get_mermaid(proc_oper: &str, call_chain_key: Option<&str>) -> String {

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => sd.get_mermaid_diagram(proc_oper, call_chain_key),
        None => {
            error!("Not stitched data loaded");
            String::new()
        }
    }
}
