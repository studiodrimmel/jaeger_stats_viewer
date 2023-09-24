import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { Graph, GRAPHS} from "../graph";
// logging
import { info } from "tauri-plugin-log-api";  

Chart.register(...registerables);

import { invoke } from "@tauri-apps/api/tauri";

@Component({
  selector: 'app-jaeger-chart',
  templateUrl: './jaeger-chart.component.html',
  styleUrls: ['./jaeger-chart.component.css']
})
export class JaegerChartComponent implements OnInit {

  graphs = [{id: -500, name: "CvK"}];
  selectedGraph?: Graph;

  onSelect(graph: Graph): void {
    this.selectedGraph = graph;
  }

  ngOnInit() {
    this.graphs = GRAPHS;

    var name = "Peter Pan";
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<string>("greet", { name }).then((text) => {
      info("Returned from RUST: greet  with:");
      info(String(text));
  
      var id = this.graphs.length + 1;
      this.graphs.push({id: id, name: text });
    });

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<Graph[]>("get_graphs", {  }).then((graphs) => {
      info("Returned from RUST: get_graphs  with:");
      info(String(graphs));
      var id = this.graphs.length + 1;

      this.graphs.push(...graphs);
    });
    

 var myChart = new Chart("jaegerChart", {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

 const data_2 = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

 var myChart_2 = new Chart("jaegerChart-2", {
    type: 'bar',
    data: {
        labels: data_2.map(row => row.year),
        datasets: [{
            label: 'Acquistion by year',
            data: data_2.map(row => row.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ]
        }]
    }
});

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

//const labels = months({count: 7});
//const labels = ['jan', 'febr', 'MAAAART', 'April', 'mEi', 'Juni', 'JulY'];

  var chart_label = "unknown";
  var chart_metric = "unknown-metric"
  info("################################     ABOUT to invoke get_chart_descr!!");
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  invoke<ChartConfiguration<keyof ChartTypeRegistry, Number, Number>>("get_chart_descr", { chart_label, chart_metric }).then((chart_descr) => {
    info("Returned from RUST: get_chart_descr  with:");
    info(String(chart_descr));

    var mychart_3 = new Chart("jaegerChart-3", chart_descr);

  });

// var mychart_3 = new Chart("jaegerChart-3", {
//   type: 'line',
//   data: {
//     labels: ['jan', 'febr', 'MAAAART', 'April', 'mEi', 'Juni', 'JulY'], 
//   datasets: [
//     {
//     label: 'My First Dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//     fill: false,
//     borderColor: 'rgb(75, 192, 192)',
//     tension: 0.1
//   },
//     {
//     label: 'Extra Dataset',
//     data: [100, 90, 80, 75, 70, 75, 40],
//     fill: false,
//     borderColor: 'rgb(255, 0, 0)',
//     tension: 0.1
//   }
// ]
// }
//  });
}
}
