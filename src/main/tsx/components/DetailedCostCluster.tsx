import * as React from "react";
import { DetailedCostClusterModel } from "../model/DetailedCostClusterModel";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Paper, TableBody } from "@material-ui/core";

export interface DetailedCostClusterProps {
    detailedClusters: DetailedCostClusterModel[];
}

export const DetailedCostCluster: React.FunctionComponent<DetailedCostClusterProps> = (props) => {

    const { detailedClusters } = props;
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Cluster</TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {detailedClusters.map(row => {
                        return (
                            <TableRow key={row.name}>
                                <TableCell>{row.cluster}</TableCell>
                                <TableCell>{row.name}</TableCell>
                            </TableRow>
                        );
                    })

                    }
                </TableBody>

            </Table>
        </Paper >
    );

}