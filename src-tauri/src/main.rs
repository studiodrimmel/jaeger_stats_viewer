// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;
use log::{error, info};
use std::env;
//use std::{error::Error, fs, io, time::Instant};

mod backend;
mod chart_descr;
mod file_descr;

use backend::load_stitch_data;
use chart_descr::{get_call_chain_data, get_call_chain_list, get_process_data, get_process_list};
use file_descr::get_file_stats;

const DEFAULT_INPUT_FILE: &str = "stitched.bincode";

/// Check on references between spans..
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// A single json input-file that should be analysed to collect all tags
    #[arg(short, long, default_value_t = String::new())]
    input_file: String,
}

fn main() {
    let args = Args::parse();

    // Default-value is from the environment and otherwise a hard-coded default is taken.
    let default_input = match env::var("JEAGER_STATS_INPUT") {
        Ok(input_file) => input_file,
        Err(_err) => String::from(DEFAULT_INPUT_FILE),
    };
    // the provided input_file is tried first, otherwise the default is loaded.
    let input_file = if !args.input_file.is_empty() {
        &args.input_file[..]
    } else {
        &default_input[..]
    };

    println!("Starting the backend server for the Jaeger-stats dashboard");
    info!("Starting the back-end server for the Jaeger-stats dashboard");
    match &load_stitch_data(input_file)[..] {
        "Ok" | "ok" => {
            tauri::Builder::default()
                .plugin(tauri_plugin_log::Builder::default().build()) // allow Tauri logging
                .invoke_handler(tauri::generate_handler![
                    load_stitch_data,
                    get_process_list,
                    get_process_data,
                    get_call_chain_data,
                    get_call_chain_list,
                    get_file_stats
                ])
                .run(tauri::generate_context!())
                .expect("error while running tauri application");
        }
        err => {
            println!("Load of '{input_file}' failed with error: {}", err);
            error!("Load of '{input_file}' failed with error: {}", err);
            panic!("Failed to load file: {}", err);
        }
    };
}
