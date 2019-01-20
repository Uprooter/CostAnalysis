import * as React from "react";
import YearlyCost from "../models/YearlyCost";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";


interface ClusterHistoryChartProps {
    yearlyClusterCosts: YearlyCost[];
}
interface ClusterHistoryChartState {
    chart: any;
}
export default class ClusterHistoryChart extends React.Component<ClusterHistoryChartProps, ClusterHistoryChartState> {

    // state={
    //     chart: 
    // }
    
    // componentDidMount() {
    //     let chart = am4core.create("chartdiv", am4charts.XYChart);

    //     chart.paddingRight = 20;

    //     chart.data = this.props.yearlyClusterCosts;

    //     let yearAxis = chart.xAxes.push(new am4charts.ValueAxis());
    //     yearAxis.renderer.grid.template.location = 0;

    //     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //     valueAxis.tooltip.disabled = true;
    //     valueAxis.renderer.minWidth = 35;

    //     let series = chart.series.push(new am4charts.LineSeries());
    //     series.dataFields.dateX = "year";
    //     series.dataFields.valueY = "mischaAmount";

    //     series.tooltipText = "{valueY.value}";
    //     chart.cursor = new am4charts.XYCursor();

    //     let scrollbarX = new am4charts.XYChartScrollbar();
    //     scrollbarX.series.push(series);
    //     chart.scrollbarX = scrollbarX;

    //     this.chart = chart;
    // }
    // componentWillUnmount() {
    //     if (this.chart) {
    //         this.chart.dispose();
    //     }
    // }
    render() {
        console.log(this.props.yearlyClusterCosts);
        return (
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        );
    }
}