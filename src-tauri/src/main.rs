// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;
use log::{error, info};
//use std::{error::Error, fs, io, time::Instant};

mod backend;
mod chart_descr;

use chart_descr::{get_process_data, get_process_list, get_call_chain_data, get_call_chain_list};
use backend::load_stitch_data;

/// Check on references between spans..
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// A single json input-file that should be analysed to collect all tags
    #[arg(short, long, default_value_t = String::from("stitched.bincode"))]
    input_file: String,
}


fn main() {
    let args = Args::parse();

    let input_file = &args.input_file;

    info!("Starting the back-end server");
    match &load_stitch_data(input_file)[..] {
        "Ok" => {
            tauri::Builder::default()
            .plugin(tauri_plugin_log::Builder::default().build()) // allow Tauri logging
            .invoke_handler(tauri::generate_handler![load_stitch_data, get_process_list, get_process_data, get_call_chain_data, get_call_chain_list])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");    
        },
        err => {
            error!("Load of '{input_file}' failed with error: {}", err);
            panic!("Failed to load file: {}", err);
        }

    };

}
