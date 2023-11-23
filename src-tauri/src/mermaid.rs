use super::backend::STITCHED;
use log::error;



#[tauri::command]
pub fn get_mermaid(proc_oper: &str, call_chain_key: Option<&str>, scope: &str, compact: bool) -> String {

    let guard = STITCHED.lock().unwrap();
    match &*guard {
        Some(sd) => sd.get_mermaid_diagram(proc_oper, call_chain_key, scope.to_string(), compact),
        None => {
            error!("Not stitched data loaded");
            String::new()
        }
    }
}
