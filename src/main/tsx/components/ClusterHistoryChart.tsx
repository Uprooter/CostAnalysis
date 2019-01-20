import * as React from 'react';
import { Chart } from "chart.js";
import { Typography } from '@material-ui/core';
import YearlyCost from '../models/YearlyCost';

const ClusterHistoryChart = (props: any) => {

    const getJSONForOwer = function (owner: string, yearlyClusterCosts: YearlyCost[]) {
        if (yearlyClusterCosts.length === 0) {
            return {};
        }
        let jsonString: string = "{";
        for (let yearlyCost of yearlyClusterCosts) {
            if (owner === "mischa") {
                jsonString += "\"" + yearlyCost.year.toString() + "\":" + yearlyCost.mischaAmount + ",";
            }
            else {
                jsonString += "\"" + yearlyCost.year.toString() + "\":" + yearlyCost.gesaAmount + ",";
            }
        }

        return JSON.parse(jsonString.substring(0, (jsonString.length - 1)) + "}");
    }

    let chartKick = require("react-chartkick");
    chartKick.default.addAdapter(Chart);

    return (
        <React.Fragment>
            <Typography variant="h5" component="h3" style={{ marginBottom: 5 }}>
                Entwicklung für Typ: {props.selectedClusterForHistory}
            </Typography>
            <chartKick.ColumnChart
                colors={["#2196f3", "#0174DF"]}
                stacked={true}
                data={[{ "name": "Mischa", "data": getJSONForOwer("mischa", props.yearlyClusterCosts) },
                { "name": "Gesa", "data": getJSONForOwer("gesa", props.yearlyClusterCosts) }]} />

        </React.Fragment>
    );
}

export default ClusterHistoryChart;