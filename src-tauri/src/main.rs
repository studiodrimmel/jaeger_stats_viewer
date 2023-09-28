// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;

mod backend;
mod chart_descr;

use chart_descr::{get_process_data, get_process_list};
use backend::load_stitch_data;


fn main() {
    info!("Starting the back-end server");
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build()) // allow Tauri logging
        .invoke_handler(tauri::generate_handler![load_stitch_data, get_process_list, get_process_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
