// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use log::info;

mod chart_descr;

use chart_descr::get_chart_descr;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    info!("RUST: Received call to greet({name})");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize)]
struct Graph {
    id: isize,
    name: String
}

#[tauri::command]
fn get_graphs() -> Vec<Graph> {
    info!("RUST: Received call to get_graphs");
    vec![
        Graph {id: -100, name: "test-graphs".to_string()},
        Graph {id: -200, name: "Another item".to_string()},

    ]
}


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build()) // allow Tauri logging
        .invoke_handler(tauri::generate_handler![greet,get_graphs,get_chart_descr])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
