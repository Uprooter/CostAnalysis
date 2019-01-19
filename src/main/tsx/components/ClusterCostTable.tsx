import * as React from "react";
import TotalTableCell from "./TotalTableCell";
import ClusterCost from "../models/ClusterCost";
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { toRoundEuroString } from "../utils/numbers";

interface ClusterCostTableProps {
    clusterCosts: ClusterCost[];
}
export default class ClusterCostTable extends React.Component<ClusterCostTableProps, {}> {
    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Typ</TableCell>
                        <TableCell>Mischa</TableCell>
                        <TableCell>Gesa</TableCell>
                        <TotalTableCell>Summe</TotalTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.clusterCosts.map(row => {
                        return (
                            <TableRow key={row.cluster}>
                                <TableCell>{row.cluster}</TableCell>
                                <TableCell>{toRoundEuroString(row.mischaAmount)}</TableCell>
                                <TableCell>{toRoundEuroString(row.gesaAmount)}</TableCell>
                                <TotalTableCell>{toRoundEuroString(row.totalAmount)}</TotalTableCell>
                            </TableRow>
                        );
                    })
                    }
                </TableBody>
            </Table>
        );
    }
}