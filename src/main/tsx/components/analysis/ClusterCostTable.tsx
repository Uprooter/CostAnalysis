import * as React from "react";
import TotalTableCell from "../util/TotalTableCell";
import ClusterCost from "../../models/ClusterCost";
import ClusterDetailsDialog from "./ClusterDetailsDialog";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Button } from '@material-ui/core';
import { toRoundEuroString } from "../../utils/numbers";
import { getRequest } from '../../utils/rest';
import { getDateString } from '../../utils/dates';
import CostItemModel from "../../models/CostItemModel";

interface ClusterCostTableProps {
    clusterCosts: ClusterCost[];
    loadClusterHistory: (cluster: string) => void;
    from: Date;
    to: Date;
}
interface ClusterCostTableState {
    dialogOpen: boolean;
    selectedCluster: string;
    selectedClusterCosts: CostItemModel[];
}
export default class ClusterCostTable extends React.Component<ClusterCostTableProps, ClusterCostTableState> {

    state = {
        dialogOpen: false,
        selectedCluster: "",
        selectedClusterCosts: new Array<CostItemModel>()
    }

    handleRowClick(event: React.MouseEvent<HTMLTableRowElement>, cluster: string) {
        this.props.loadClusterHistory(cluster);
    }

    showClusterDetails = (cluster: string) => {
        this.setState({ selectedCluster: cluster }, () => this.changeDialogVisibility(true));

        getRequest("/clusterCostsByCluster?from=" + getDateString(this.props.from)
            + "&to=" + getDateString(this.props.to)
            + "&clusterName=" + cluster)
            .then(r => {
                this.updateSelectedClusterCostsWithClientId(r.entity);
            });
    }

    updateSelectedClusterCostsWithClientId = (selectedClusterCosts: CostItemModel[]) => {
        let costsWithClientId: CostItemModel[] = new Array<CostItemModel>();
        for (let i in selectedClusterCosts) {
            let item: CostItemModel = selectedClusterCosts[i];
            item.clientId = item.id;
            costsWithClientId.push(item);
        }
        this.setState({ selectedClusterCosts: costsWithClientId });
    }

    changeDialogVisibility = (dialogOpen: boolean) => {
        this.setState({ dialogOpen: dialogOpen });
    }

    render() {
        return (
            <React.Fragment>
                <Typography variant="h5" component="h3" style={{ marginBottom: 5 }}>
                    Zusammenfassung Nach Typ
                </Typography>

                <ClusterDetailsDialog
                    dialogOpen={this.state.dialogOpen}
                    selectedCluster={this.state.selectedCluster}
                    changeDialogVisibility={this.changeDialogVisibility}
                    clusterCosts={this.state.selectedClusterCosts} />

                <Table>
                    <TableHead>
                        <TableRow>
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
                                    <TableCell>
                                        <Button onClick={event => this.showClusterDetails(row.cluster)}>Details</Button>
                                    </TableCell>
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