import * as React from 'react';
import { Chart } from "chart.js";

const ClusterHistoryChart = (props: any) => {
    let chartKick = require("react-chartkick");
    chartKick.default.addAdapter(Chart);

    return (
        <chartKick.ColumnChart colors={["#2196f3", "#0174DF"]} stacked={true} data={[{ "name": "Mischa", "data": props.mischaClusterCosts },
        { "name": "Gesa", "data": props.gesaClusterCosts }]} />
    );
}

export default ClusterHistoryChart;