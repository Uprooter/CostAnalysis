import * as React from "react";
import TotalTableCell from "../util/TotalTableCell";
import CompareModel from "../../models/CompareModel";
import ClusterDetailsDialog from "../analysis/ClusterDetailsDialog";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { toRoundEuroString } from "../../utils/numbers";
import { getRequest } from '../../utils/rest';
import CostItemModel from "../../models/CostItemModel";
import ListIcon from '@material-ui/icons/List';
import IconButton from '@material-ui/core/IconButton';
import { getDateString, getDashDateString, getYearMonthString } from "../../utils/dates";

interface CompareTableProps {
    clusterCompareItems: CompareModel[];
    loadClusterHistory: (cluster: string, month: Date) => void;
    monthA: Date;
    monthB: Date;
}
interface CompareTableState {
    dialogOpen: boolean;
    selectedCluster: string;
    selectedClusterCosts: CostItemModel[];
}
export default class CompareTable extends React.Component<CompareTableProps, CompareTableState> {

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
                    Vergleich von {getYearMonthString(this.props.monthA)} zu {getYearMonthString(this.props.monthB)}
                </Typography>

                <ClusterDetailsDialog
                    dialogOpen={this.state.dialogOpen}
                    selectedCluster={this.state.selectedCluster}
                    changeDialogVisibility={this.changeDialogVisibility}
                    clusterCosts={this.state.selectedClusterCosts} />

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}></TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Unterschied</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.clusterCompareItems.map(row => {
                            return (
                                <TableRow key={row.cluster} hover onClick={event => this.handleRowClick(event, row.cluster)}>
                                    <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>
                                        <IconButton onClick={event => this.showClusterDetails(row.cluster)}><ListIcon /></IconButton>
                                    </TableCell>
                                    <TableCell>{row.cluster}</TableCell>
                                    <TableCell>{toRoundEuroString(row.change)}</TableCell>
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