import * as React from "react";
import { FormControlLabel, Button, Switch, FormGroup, Grid, TextField } from '@material-ui/core';
import { getDateString, getDashDateString, getOneYearBefore } from "../../utils/dates";
import { getRequest } from "../../utils/rest";
import AverageCostResult from "../../models/AverageCostResult";
import { UpdateAverageCostsAction, UpdateClusterCostsAction, UpdateAnalysisDatesAction } from "../../actions/actions";
import ClusterCost from "../../models/ClusterCost";

interface CostOverviewControlProps {
    updateAverageCostResult: (averageCosts: AverageCostResult) => UpdateAverageCostsAction;
    updateClusterCosts: (clusterCosts: ClusterCost[]) => UpdateClusterCostsAction;
    updateAnalysisDates: (from: Date, to: Date) => UpdateAnalysisDatesAction;
    from: Date;
    to: Date;
}
interface CostOverviewControlState {
    includeOthers: boolean;
    savingsAreCosts: boolean;
}
export default class CostOverviewControl extends React.Component<CostOverviewControlProps, CostOverviewControlState> {

    state = {
        includeOthers: false,
        savingsAreCosts: false,
    }

    componentDidMount() {
        this.updateCosts();
    }

    componentDidUpdate(prevProps: CostOverviewControlProps) {
        if (prevProps.from !== this.props.from || prevProps.to !== this.props.to) {
            this.updateCosts();
        }
    }

    updateCosts = () => {
        this.loadAverageCosts();
        this.loadClusterCosts();
    }

    loadClusterCosts = () => {
        getRequest("/clusterCosts?from=" + getDateString(this.props.from)
            + "&to=" + getDateString(this.props.to))
            .then(r => {
                this.props.updateClusterCosts(r.entity);
            });
    }

    getYears(): number[] {
        let years: number[] = new Array<number>();
        let currentYear: number = new Date().getFullYear();
        for (let year = 2014; year <= currentYear; year++) {
            years.push(year);
        }

        return years;
    }

    loadAverageCosts = () => {
        getRequest("/averageCosts?from=" + getDateString(this.props.from)
            + "&to=" + getDateString(this.props.to)
            + "&includeOthers=" + this.state.includeOthers
            + "&savingsAreCosts=" + this.state.savingsAreCosts)
            .then(r => {
                this.props.updateAverageCostResult(r.entity);
            });
    }

    handleIncludeOthersChange(include: boolean) {
        this.setState({ includeOthers: include }, () => this.loadAverageCosts());
    }

    handleWithSavingsChange(savingsAreCosts: boolean) {
        this.setState({ savingsAreCosts: savingsAreCosts }, () => this.loadAverageCosts());
    }

    handleDateChange(newDate: Date, dateField: string) {
        if (dateField === "fromDate") {
            this.props.updateAnalysisDates(newDate, this.props.to);
        }
        else {
            this.props.updateAnalysisDates(this.props.from, newDate);
        }
    }

    updateDateRangeToFullYear(year: number) {
        let fromDate: Date = new Date(year, 0, 1, 22);
        let toDate: Date = new Date(year, 11, 31, 22);

        this.props.updateAnalysisDates(fromDate, toDate);
    }

    render() {
        const gridItemStyle = { marginLeft: 10, marginTop: 20 };
        const years = this.getYears();
        return (
            <Grid container spacing={16}>
                <Grid item sm style={gridItemStyle}>
                    <TextField id="fromDate" label="Von" type="date" style={{ margin: 5 }} value={getDashDateString(this.props.from)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "fromDate") }}
                    />
                    <TextField id="fromDate" label="Bis" type="date" style={{ margin: 5 }} value={getDashDateString(this.props.to)}
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
            </Grid>
        );
    }
}