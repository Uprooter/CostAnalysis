import * as React from 'react';
import { Chart } from "chart.js";
import { Typography } from '@material-ui/core';
import TimeFrameCostEntry from '../../models/TimeFrameCostEntry';

const ClusterHistoryChart = (props: any) => {

    const getJSONForOwer = function (owner: string, clusterCosts: TimeFrameCostEntry[]) {
        if (clusterCosts.length === 0) {
            return {};
        }
        let jsonString: string = "{";
        for (let costPerTime of clusterCosts) {
            if (owner === "mischa") {
                jsonString += "\"" + costPerTime.timeFrame + "\":" + costPerTime.mischaAmount + ",";
            }
            else {
                jsonString += "\"" + costPerTime.timeFrame + "\":" + costPerTime.gesaAmount + ",";
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
                data={[{ "name": "Mischa", "data": getJSONForOwer("mischa", props.clusterCosts) },
                { "name": "Gesa", "data": getJSONForOwer("gesa", props.clusterCosts) }]} />

        </React.Fragment>
    );
}

export default ClusterHistoryChart;