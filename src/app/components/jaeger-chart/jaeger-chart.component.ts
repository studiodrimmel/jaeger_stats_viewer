import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { Graph, GRAPHS} from "../../graph";
import { ChartDataParameters } from '../../chart_descr';
// logging
import { info, error } from "tauri-plugin-log-api";  

Chart.register(...registerables);

import { invoke } from "@tauri-apps/api/tauri";


function loadProcessChart(process: String, metric: String, canvasId: Number) {
  invoke<ChartDataParameters>("get_process_data", { name: process, metric: metric }).then((chdata) => { // When changing name to 'chartlabel' of chart_label it fails
    info(`Received response for process=${process} and metric=${metric}. Now write to 'jaegerChart-${canvasId}`);

    var mychart = new Chart(`jaegerChart-${canvasId}`, {
        type: 'line',
        data: {
          labels: chdata.labels, 
        datasets: [
          {
          label: 'My First Dataset',
          data: chdata.data[0],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
          {
          label: 'Extra Dataset',
          data: chdata.data[1],
          fill: false,
          borderColor: 'rgb(255, 0, 0)',
          tension: 0.1
        }
      ]
      }
    })
  });

}


@Component({
  selector: 'app-jaeger-chart',
  templateUrl: './jaeger-chart.component.html',
  styleUrls: ['./jaeger-chart.component.css']
})
export class JaegerChartComponent implements OnInit {

  graphs = [{id: -1, name: "---"}];
  selectedGraph?: Graph;

  file_name = "stitched.bincode";


  onSelect(graph: Graph): void {
    this.selectedGraph = graph;

    loadProcessChart(this.selectedGraph.name, "count", 1);
    loadProcessChart(this.selectedGraph.name, "rate (avg)", 2);
    loadProcessChart(this.selectedGraph.name, "avg_duration_millis", 3);    
    loadProcessChart(this.selectedGraph.name, "p75_millis", 3);
    loadProcessChart(this.selectedGraph.name, "p90_millis", 4);
    loadProcessChart(this.selectedGraph.name, "p95_millis", 5);
    loadProcessChart(this.selectedGraph.name, "p99_millis", 6);
    loadProcessChart(this.selectedGraph.name, "max_millis", 7);
    loadProcessChart(this.selectedGraph.name, "frac_not_http_ok", 9);
    loadProcessChart(this.selectedGraph.name, "frac_error_logs", 10);
  }

  ngOnInit() {
    info("Loading default data_file: "+ this.file_name);
    invoke<string>("load_stitch_data", { file_name: this.file_name }).then((result) => {
      if (result == "Ok") {
        info("Loaded datafile, Now retrieving process list");

        invoke<Graph[]>("get_process_list", { }).then((process_list) => {
  
          this.graphs = process_list;
  
          info("Processes loaded, now select first item to display")
          this.onSelect(this.graphs[0]);      
        });
      } else {
        error(result);
      }
    });

  //   loadProcessCharts() {
  //     // load the process charts for the selectedGraph
  //     var chartlabel = "unknown";
  //     var chart_metric = "unknown-metric"
  //     info("####     ABOUT to invoke get_chart_data!!");
  //     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //     invoke<string>("greet", { chartlabel }).then((chartdata) => {
  //       info("###### Returned from RUST: get_chart_data  with:");
  //       info(String(chartdata));
    
  //   //    var mychart_3 = new Chart("jaegerChart-3", chart_descr);
    
  //     });
    
  //     var name = "Peter Pan";
  //     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //     invoke<ChartDataParameters>("get_chart_data", { name }).then((text) => {
  //       info("Returned from RUST: greet (or actual GET_CHART_DATA) with:");
  //       info(String(text));
  //       info(String(text.labels[0]));
  //       info(String(text.data[1][2]));
    
  //       var id = this.graphs.length + 1;
  //       this.graphs.push({id: id, name: String(text) });
  //     });

  //     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //     invoke<Graph[]>("get_process_list", {  }).then((graphs) => {
  //       info("Returned from RUST: get_graphs  with:");
  //       info(String(graphs));
  //       var id = this.graphs.length + 1;

  //       this.graphs.push(...graphs);
  //     });
      

  //   var chartLabel = "process X";
  //   var chartMetric = "Average-reponse-time"
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   invoke<ChartDataParameters>("get_chart_data", { name: chartLabel, metric: chartMetric }).then((chdata) => { // When changing name to 'chartlabel' of chart_label it fails
  //     info(String(chdata));

  //     var mychart_3 = new Chart("jaegerChart", {
  //         type: 'line',
  //         data: {
  //           labels: chdata.labels, 
  //         datasets: [
  //           {
  //           label: 'My First Dataset',
  //           data: chdata.data[0],
  //           fill: false,
  //           borderColor: 'rgb(75, 192, 192)',
  //           tension: 0.1
  //         },
  //           {
  //           label: 'Extra Dataset',
  //           data: chdata.data[1],
  //           fill: false,
  //           borderColor: 'rgb(255, 0, 0)',
  //           tension: 0.1
  //         }
  //       ]
  //       }
  //     })
  //   });

  //     chartMetric = "p95 response"
  //     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //     invoke<ChartDataParameters>("get_chart_data", { name: chartLabel, metric: chartMetric }).then((chdata) => { // When changing name to 'chartlabel' of chart_label it fails
  //       info(String(chdata));
    
  //       var mychart_3 = new Chart("jaegerChart-2", {
  //         type: 'line',
  //         data: {
  //           labels: chdata.labels, 
  //         datasets: [
  //           {
  //           label: 'My First Dataset',
  //           data: chdata.data[0],
  //           fill: false,
  //           borderColor: 'rgb(75, 192, 192)',
  //           tension: 0.1
  //         },
  //           {
  //           label: 'Extra Dataset',
  //           data: chdata.data[1],
  //           fill: false,
  //           borderColor: 'rgb(255, 0, 0)',
  //           tension: 0.1
  //         }
  //       ]
  //       }
  //     });
  //   });

  // }

 }
}
