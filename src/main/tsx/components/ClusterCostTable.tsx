import * as React from "react";
import TotalTableCell from "./TotalTableCell";
import ClusterCost from "../models/ClusterCost";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { toRoundEuroString } from "../utils/numbers";

interface ClusterCostTableProps {
    clusterCosts: ClusterCost[];
    loadClusterHistory: (cluster: string) => void;
}
export default class ClusterCostTable extends React.Component<ClusterCostTableProps, {}> {

    handleRowClick(event: React.MouseEvent<HTMLTableRowElement>, cluster: string) {
        this.props.loadClusterHistory(cluster);
    }

    render() {
        return (
            <React.Fragment>
                <Typography variant="h5" component="h3" style={{ marginBottom: 5 }}>
                    Zusammenfassung Nach Typ
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Mischa</TableCell>
                            <TableCell>Gesa</TableCell>
                            <TotalTableCell>Summe</TotalTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.clusterCosts.map(row => {
                            return (
                                <TableRow key={row.cluster} hover onClick={event => this.handleRowClick(event, row.cluster)}>
                                    <TableCell>Entwicklung</TableCell>
                                    <TableCell>Details</TableCell>
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
            </React.Fragment>
        );
    }
}