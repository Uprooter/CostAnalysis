import * as React from 'react';
import { Chart } from "chart.js";

const MyChart = (props: any) => {
    let chartKick = require("react-chartkick");
    chartKick.default.addAdapter(Chart);

    return (
        <chartKick.ColumnChart stacked={true} data={[{ "name": "Gesa", "data": props.mischaClusterCosts },
        { "name": "Mischa", "data": props.gesaClusterCosts }]} />
    );

}

export default MyChart;