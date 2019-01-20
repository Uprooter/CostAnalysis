import * as React from "react";
import { NavigatioPageUpdateAction, UpdateAverageCostsAction, UpdateClusterCostsAction } from "../actions/actions";
import Page from "../utils/pages";
import { getRequest } from "../utils/rest";
import { getDateString, getDashDateString, getOneYearBefore } from "../utils/dates";
import AverageCostTable from "./AverageCostTable";
import ClusterHistoryChart from "./ClusterHistoryChart";
import ClusterCostTable from "./ClusterCostTable";
import AverageCostResult from "../models/AverageCostResult";
import { FormControlLabel, Button, Switch, Paper, Typography, FormGroup, Grid, TextField } from '@material-ui/core';
import ClusterCost from "../models/ClusterCost";
import YearlyCost from "../models/YearlyCost";
import MyChart from "../charts/Chart";

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    updateAverageCostResult: (averageCosts: AverageCostResult) => UpdateAverageCostsAction;
    updateClusterCosts: (clusterCosts: ClusterCost[]) => UpdateClusterCostsAction;
    averageCosts: AverageCostResult;
    clusterCosts: ClusterCost[];
}
interface CostOverviewState {
    fromDate: Date;
    toDate: Date;
    includeOthers: boolean;
    savingsAreCosts: boolean;
    yearlyClusterCosts: YearlyCost[];
}
export default class CostOverview extends React.Component<CostOverviewProps, CostOverviewState> {

    state = {
        fromDate: getOneYearBefore(new Date()),
        toDate: new Date(),
        includeOthers: false,
        savingsAreCosts: false,
        yearlyClusterCosts: new Array<YearlyCost>()
    }

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
        this.updateCosts();
    }

    updateCosts() {
        this.loadAverageCosts();
        this.loadClusterCosts();
    }

    loadAverageCosts() {
        getRequest("/averageCosts?from=" + getDateString(this.state.fromDate)
            + "&to=" + getDateString(this.state.toDate)
            + "&includeOthers=" + this.state.includeOthers
            + "&savingsAreCosts=" + this.state.savingsAreCosts)
            .then(r => {
                this.props.updateAverageCostResult(r.entity);
            });
    }

    loadClusterCosts() {
        getRequest("/clusterCosts?from=" + getDateString(this.state.fromDate)
            + "&to=" + getDateString(this.state.toDate))
            .then(r => {
                this.props.updateClusterCosts(r.entity);
            });
    }

    loadClusterHistory = (cluster: string) => {
        getRequest("/costsByCluster?cluster=" + cluster)
            .then(r => {
                this.setState({ yearlyClusterCosts: r.entity });
            });
    }

    getJSONForOwer(owner: string, yearlyClusterCosts: YearlyCost[]) {
        let jsonString: string = "{";
        for (let yearlyCost of yearlyClusterCosts) {
            if (owner === "mischa") {
                jsonString += "\"" + yearlyCost.year.toString() + "\":" + yearlyCost.mischaAmount.toString() + ",";
            }
            else {
                jsonString += "\"" + yearlyCost.year.toString() + "\":" + yearlyCost.gesaAmount.toString() + ",";
            }
        }
       
        console.log(jsonString.substring(0,(jsonString.length-2))+"}");
        return JSON.parse(jsonString.substring(0,(jsonString.length-2))+"}");
    }

    handleDateChange(newDate: Date, dateField: string) {
        if (dateField === "fromDate") {
            // Updating state happens async -> need to pass function which shall use the new value
            this.setState({ fromDate: newDate }, () => this.updateCosts());
        }
        else {
            this.setState({ toDate: newDate }, () => this.updateCosts());
        }
    }

    handleIncludeOthersChange(include: boolean) {
        this.setState({ includeOthers: include }, () => this.loadAverageCosts());
    }

    handleWithSavingsChange(savingsAreCosts: boolean) {
        this.setState({ savingsAreCosts: savingsAreCosts }, () => this.loadAverageCosts());
    }

    getYears(): number[] {
        let years: number[] = new Array<number>();
        let currentYear: number = new Date().getFullYear();
        for (let year = 2014; year <= currentYear; year++) {
            years.push(year);
        }

        return years;
    }

    updateDateRangeToFullYear(year: number) {
        let fromDate: Date = new Date(year, 0, 1, 22);
        let toDate: Date = new Date(year, 11, 31, 22);

        this.setState({ fromDate: fromDate, toDate: toDate }, () => this.updateCosts());

    }

    render() {
        const gridItemStyle = { marginLeft: 10, marginTop: 20 };
        const years = this.getYears();
        return (

            <Grid container spacing={16}>
                <Grid item sm style={gridItemStyle}>
                    <TextField id="fromDate" label="Von" type="date" style={{ margin: 5 }} value={getDashDateString(this.state.fromDate)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "fromDate") }}
                    />
                    <TextField id="fromDate" label="Bis" type="date" style={{ margin: 5 }} value={getDashDateString(this.state.toDate)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "toDate") }}
                    />
                </Grid>
                <Grid item sm style={gridItemStyle}>
                    {
                        years.map(year => {
                            return (
                                <Button variant="outlined" key={year.toString()} onClick={() => { this.updateDateRangeToFullYear(year) }}>
                                    {year}
                                </Button>);
                        })
                    }
                </Grid>
                <Grid item xs style={gridItemStyle}>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch checked={this.state.includeOthers} onChange={(e, checked) => { this.handleIncludeOthersChange(checked) }} />
                            }
                            label="mit Sonstiges" />
                        <FormControlLabel
                            control={
                                <Switch checked={this.state.savingsAreCosts} onChange={(e, checked) => { this.handleWithSavingsChange(checked) }} />
                            }
                            label="Sparbeiträge sind Kosten" />
                    </FormGroup>
                </Grid>
                <Grid item sm style={gridItemStyle}>
                    <Button variant="contained" color="primary" onClick={() => { this.updateCosts() }}>Laden</Button>

                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                        Zusammenfassung (monatlicher Durchschnitt)
                    </Typography>
                </Grid>

                <Grid item sm>
                    <AverageCostTable averageCosts={this.props.averageCosts} />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                        Zusammenfassung Nach Typ
                    </Typography>
                </Grid>

                <Grid item sm>
                    <ClusterCostTable clusterCosts={this.props.clusterCosts} loadClusterHistory={this.loadClusterHistory} />
                </Grid>

                <Grid item xs={12}>
                    <MyChart mischaClusterCosts={this.getJSONForOwer("mischa", this.state.yearlyClusterCosts)}
                        gesaClusterCosts={this.getJSONForOwer("gesa", this.state.yearlyClusterCosts)} />
                </Grid>
            </Grid>
        );
    }
}
