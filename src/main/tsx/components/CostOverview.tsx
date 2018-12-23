import * as React from "react";
import { NavigatioPageUpdateAction, AddCostItemsAction, UpdateAverageCostsAction } from "../actions/actions";
import Page from "../utils/pages";
import CostItemModel from "../models/CostItemModel";
import AverageCostResult from "../models/AverageCostResult";
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { FormControlLabel, Button, Switch, Paper, Typography, FormGroup, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    addCostItems: (newItems: CostItemModel[]) => AddCostItemsAction;
    updateAverageCostResult: (averageCosts: AverageCostResult) => UpdateAverageCostsAction;
    costItems: CostItemModel[];
    averageCosts: AverageCostResult;
}
export default class CostOverview extends React.Component<CostOverviewProps, {}> {

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
    }

    loadAverageCosts() {
        let client = rest.wrap(mime);
        client({ path: "/api/averageCosts?from=01.01.2018&to=30.09.2018&includeOthers=false" }).then(r => {
            this.props.updateAverageCostResult(r.entity);
        });
    }


    TotalTableRow = withStyles(theme => ({
        root: {
            backgroundColor: "#81BEF7",
            color: theme.palette.common.white,
        }
    }))(TableRow);

    TotalTableCell = withStyles(theme => ({
        root: {
            backgroundColor: "#81BEF7",
        }
    }))(TableCell);

    TotalSumTableCell = withStyles(theme => ({
        root: {
            backgroundColor: "#0174DF",
            color: theme.palette.common.white,
        }
    }))(TableCell);

    render() {

        return (
            <Paper elevation={1}>
                <Typography variant="h5" component="h3">
                    Zusammenfassung (monatlicher Durchschnitt)
                </Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                        <DatePicker margin="normal" label="Von" value={new Date("2018-11-11")} onChange={() => { }} />
                        <DatePicker margin="normal" label="Bis" value={new Date("2018-12-11")} onChange={() => { }} />
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch checked={false} onChange={(event) => { }} />
                                }
                                label="mit Sonstiges"
                            /></FormGroup>
                        <Button variant="contained" color="primary" onClick={() => { this.loadAverageCosts() }}>Laden</Button>
                    </Grid>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Mischa</TableCell>
                                <TableCell>Gesa</TableCell>
                                <this.TotalTableCell>Summe</this.TotalTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key="fixed">
                                <TableCell>Feste Ausgabe</TableCell>
                                <TableCell>{this.props.averageCosts.fixedCostsMischa}</TableCell>
                                <TableCell>{this.props.averageCosts.fixedCostsGesa}</TableCell>
                                <this.TotalTableCell>{this.props.averageCosts.totalAverageFixedCosts}</this.TotalTableCell>
                            </TableRow>
                            <TableRow key="flexible">
                                <TableCell>Flexible Ausgabe</TableCell>
                                <TableCell>{this.props.averageCosts.flexCostsMischa}</TableCell>
                                <TableCell>{this.props.averageCosts.flexCostsGesa}</TableCell>
                                <this.TotalTableCell>{this.props.averageCosts.totalAverageFlexCosts}</this.TotalTableCell>
                            </TableRow>
                            <TableRow key="saved">
                                <TableCell>Gespart</TableCell>
                                <TableCell>{this.props.averageCosts.diffMischa}</TableCell>
                                <TableCell>{this.props.averageCosts.diffGesa}</TableCell>
                                <this.TotalTableCell>{this.props.averageCosts.totalDiff}</this.TotalTableCell>
                            </TableRow>
                            <this.TotalTableRow key="total">
                                <TableCell>Summe</TableCell>
                                <TableCell>{this.props.averageCosts.totalAverageMischa}</TableCell>
                                <TableCell>{this.props.averageCosts.totalAverageGesa}</TableCell>
                                <this.TotalSumTableCell>{456}</this.TotalSumTableCell>
                            </this.TotalTableRow>
                        </TableBody>
                    </Table>
                </MuiPickersUtilsProvider>
            </Paper>

        );
    }
}
