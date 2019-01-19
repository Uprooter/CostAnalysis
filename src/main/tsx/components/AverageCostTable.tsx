import * as React from "react";
import AverageCostResult from "../models/AverageCostResult";
import { toRoundEuroString } from "../utils/numbers";
import TotalTableCell from "../components/TotalTableCell";
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
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



    TotalSumTableCell = withStyles(theme => ({
        root: {
            backgroundColor: "#0174DF",
            color: theme.palette.common.white,
        }
    }))(TableCell);


    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Mischa</TableCell>
                        <TableCell>Gesa</TableCell>
                        <TotalTableCell>Summe</TotalTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key="fixed">
                        <TableCell>Feste Ausgaben</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.fixedCostsMischa)}</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.fixedCostsGesa)}</TableCell>
                        <TotalTableCell>{toRoundEuroString(this.props.averageCosts.totalAverageFixedCosts)}</TotalTableCell>
                    </TableRow>
                    <TableRow key="flexible">
                        <TableCell>Flexible Ausgaben</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.flexCostsMischa)}</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.flexCostsGesa)}</TableCell>
                        <TotalTableCell>{toRoundEuroString(this.props.averageCosts.totalAverageFlexCosts)}</TotalTableCell>
                    </TableRow>
                    <this.TotalTableRow key="total">
                        <TableCell>Summe Kosten</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.totalAverageMischa)}</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.totalAverageGesa)}</TableCell>
                        <this.TotalSumTableCell>{toRoundEuroString(this.props.averageCosts.totalCosts)}</this.TotalSumTableCell>
                    </this.TotalTableRow>
                    <TableRow key="saved">
                        <TableCell>Gespart Durchsch. Pro Monat</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.averageSavingsMischa)}</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.averageSavingsGesa)}</TableCell>
                        <TotalTableCell>{toRoundEuroString(this.props.averageCosts.totalAverageSavings)}</TotalTableCell>
                    </TableRow>
                    <TableRow key="savedAbsolute">
                        <TableCell>Gespart (insgesamt Zeitraum)</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.absoluteDiffMischa)}</TableCell>
                        <TableCell>{toRoundEuroString(this.props.averageCosts.absoluteDiffGesa)}</TableCell>
                        <TotalTableCell>{toRoundEuroString(this.props.averageCosts.absoluteTotalDiff)}</TotalTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}