import * as React from "react";
import { NavigatioPageUpdateAction, UpdateAverageCostsAction, UpdateClusterCostsAction } from "../actions/actions";
import Page from "../utils/pages";
import { getDateString, getDashDateString, getOneYearBefore } from "../utils/dates";
import AverageCostTable from "./AverageCostTable";
import ClusterCostTable from "./ClusterCostTable";
import AverageCostResult from "../models/AverageCostResult";
import { FormControlLabel, Button, Switch, Paper, Typography, FormGroup, Grid, TextField } from '@material-ui/core';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import ClusterCost from "../models/ClusterCost";

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
}
export default class CostOverview extends React.Component<CostOverviewProps, CostOverviewState> {

    state = {
        fromDate: getOneYearBefore(new Date()),
        toDate: new Date(),
        includeOthers: false,
        savingsAreCosts: false
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
        let client = rest.wrap(mime);
        client({
            path: "/averageCosts?from=" + getDateString(this.state.fromDate)
                + "&to=" + getDateString(this.state.toDate)
                + "&includeOthers=" + this.state.includeOthers
                + "&savingsAreCosts=" + this.state.savingsAreCosts
        }).then(r => {
            this.props.updateAverageCostResult(r.entity);
        });
    }

    loadClusterCosts() {
        let client = rest.wrap(mime);
        client({
            path: "/clusterCosts?from=" + getDateString(this.state.fromDate)
                + "&to=" + getDateString(this.state.toDate)
        }).then(r => {
            this.props.updateClusterCosts(r.entity);
        });
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

    render() {
        const gritItemStyle = { marginLeft: 20, marginTop: 20 };
        return (

            <Grid container spacing={16}>
                <Grid item sm style={gritItemStyle}>
                    <TextField id="fromDate" label="Von" type="date" defaultValue={getDashDateString(this.state.fromDate)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "fromDate") }}
                    />
                    <TextField id="fromDate" label="Bis" type="date" defaultValue={getDashDateString(this.state.toDate)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "toDate") }}
                    />
                </Grid>
                <Grid item sm style={gritItemStyle}>
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
                <Grid item sm style={gritItemStyle}>
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
                    <ClusterCostTable clusterCosts={this.props.clusterCosts} />
                </Grid>
            </Grid>
        );
    }
}
