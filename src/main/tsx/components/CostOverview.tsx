import * as React from "react";
import { NavigatioPageUpdateAction, UpdateAverageCostsAction } from "../actions/actions";
import Page from "../utils/pages";
import { getDateString, getDashDateString, getOneYearBefore } from "../utils/dates";
import AverageCostTable from "./AverageCostTable";
import AverageCostResult from "../models/AverageCostResult";
import { FormControlLabel, Button, Switch, Paper, Typography, FormGroup, Grid, TextField } from '@material-ui/core';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    updateAverageCostResult: (averageCosts: AverageCostResult) => UpdateAverageCostsAction;
    averageCosts: AverageCostResult;
}
interface CostOverviewState {
    fromDate: Date;
    toDate: Date;
    includeOthers: boolean;
}
export default class CostOverview extends React.Component<CostOverviewProps, CostOverviewState> {

    state = {
        fromDate: getOneYearBefore(new Date()),
        toDate: new Date(),
        includeOthers: false,
    }

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
        this.loadAverageCosts();
    }

    loadAverageCosts() {
        let client = rest.wrap(mime);
        client({
            path: "/averageCosts?from=" + getDateString(this.state.fromDate)
                + "&to=" + getDateString(this.state.toDate)
                + "&includeOthers=" + this.state.includeOthers
        }).then(r => {
            this.props.updateAverageCostResult(r.entity);
        });
    }

    handleDateChange(newDate: Date, dateField: string) {
        if (dateField === "fromDate") {
            // Updating state happens async -> need to pass function which shall use the new value
            this.setState({ fromDate: newDate }, () => this.loadAverageCosts());
        }
        else {
            this.setState({ toDate: newDate }, () => this.loadAverageCosts());
        }
    }

    handleIncludeOthersChange(include: boolean) {
        this.setState({ includeOthers: include }, () => this.loadAverageCosts());
    }

    render() {
        return (
            <Paper elevation={1}>
                <Typography variant="h5" component="h3">
                    Zusammenfassung (monatlicher Durchschnitt)
                </Typography>
                <Grid container justify="space-around">
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

                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch checked={this.state.includeOthers} onChange={(e, checked) => { this.handleIncludeOthersChange(checked) }} />
                            }
                            label="mit Sonstiges"
                        /></FormGroup>
                    <Button variant="contained" color="primary" onClick={() => { this.loadAverageCosts() }}>Laden</Button>
                </Grid>

                <AverageCostTable averageCosts={this.props.averageCosts} />
            </Paper>
        );
    }
}
