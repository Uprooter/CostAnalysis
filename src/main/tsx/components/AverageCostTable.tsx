import * as React from "react";
import AverageCostResult from "../models/AverageCostResult";
import { Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

interface AverageCostTableProps {
    averageCosts: AverageCostResult;
}
export default class AverageCostTable extends React.Component<AverageCostTableProps, {}> {

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

    toRoundEuroString(value:number):string{
        return Math.ceil(value)+" €"
    }

    render() {
        return (
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
                        <TableCell>Feste Ausgaben</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.fixedCostsMischa)}</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.fixedCostsGesa)}</TableCell>
                        <this.TotalTableCell>{this.toRoundEuroString(this.props.averageCosts.totalAverageFixedCosts)}</this.TotalTableCell>
                    </TableRow>
                    <TableRow key="flexible">
                        <TableCell>Flexible Ausgaben</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.flexCostsMischa)}</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.flexCostsGesa)}</TableCell>
                        <this.TotalTableCell>{this.toRoundEuroString(this.props.averageCosts.totalAverageFlexCosts)}</this.TotalTableCell>
                    </TableRow>
                    <this.TotalTableRow key="total">
                        <TableCell>Summe Kosten</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.totalAverageMischa)}</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.totalAverageGesa)}</TableCell>
                        <this.TotalSumTableCell>{this.toRoundEuroString(this.props.averageCosts.totalCosts)}</this.TotalSumTableCell>
                    </this.TotalTableRow>
                    <TableRow key="saved">
                        <TableCell>Gespart Durchsch. Pro Monat</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.averageSavingsMischa)}</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.averageSavingsGesa)}</TableCell>
                        <this.TotalTableCell>{this.toRoundEuroString(this.props.averageCosts.totalAverageSavings)}</this.TotalTableCell>
                    </TableRow>                 
                    <TableRow key="savedAbsolute">
                        <TableCell>Gespart (insgesamt Zeitraum)</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.absoluteDiffMischa)}</TableCell>
                        <TableCell>{this.toRoundEuroString(this.props.averageCosts.absoluteDiffGesa)}</TableCell>
                        <this.TotalTableCell>{this.toRoundEuroString(this.props.averageCosts.absoluteTotalDiff)}</this.TotalTableCell>
                    </TableRow>                    
                </TableBody>
            </Table>
        );
    }
}