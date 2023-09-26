

export interface Dataset {
        label: String,
        data: Number[],
        fill: Boolean,
        // tension: Number,
        // backgroundColor: String[],
        // borderColor: String[],
        // borderWidth: Number
}

export interface ChartData {
        labels: String[],
        datasets: Dataset[]
}

export interface ChartScale {
    beginAtZero: boolean
}

export interface ChartScales {
    x: ChartScale,
    y: ChartScale
}
export interface ChartOptions {
    scales: ChartScales
}

export interface ChartDescr {
    type_rs: String,  // the rust alternative
    type: String,  // this field can not exist in Rust as type is a reserved word.
    data: ChartData,
    options: ChartOptions 
}


export interface ChartDataParameters {
    labels: String[],
    data: Number[][]
}