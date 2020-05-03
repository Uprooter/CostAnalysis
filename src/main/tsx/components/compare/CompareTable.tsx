import * as React from "react";
import CompareModel from "../../models/CompareModel";
import ClusterDetailsDialog from "../analysis/ClusterDetailsDialog";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { toRoundEuroString } from "../../utils/numbers";
import { getRequest } from '../../utils/rest';
import CostItemModel from "../../models/CostItemModel";
import ListIcon from '@material-ui/icons/List';
import IconButton from '@material-ui/core/IconButton';
import { getDateString, getDateWithLastDayOfSameMonth, getYearMonthString } from "../../utils/dates";

interface CompareTableProps {
    clusterCompareItems: CompareModel[];
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

    showClusterDetails = (cluster: string, date: Date) => {
        this.setState({ selectedCluster: cluster }, () => this.changeDialogVisibility(true));

        getRequest("/clusterCostsByCluster?from=" + getDateString(date) //1.month.year
            + "&to=" + getDateString(getDateWithLastDayOfSameMonth(date)) // last day of month
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
                            <TableCell>Typ</TableCell>
                            <TableCell>Unterschied</TableCell>
                            <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>Details {getYearMonthString(this.props.monthA)}</TableCell>
                            <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>Details {getYearMonthString(this.props.monthB)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.clusterCompareItems.map(row => {
                            return (
                                <TableRow key={row.cluster}>                                    
                                    <TableCell>{row.cluster}</TableCell>
                                    <TableCell>{toRoundEuroString(row.change)}</TableCell>
                                    <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>
                                        <IconButton onClick={event => this.showClusterDetails(row.cluster, this.props.monthA)}><ListIcon /></IconButton>
                                    </TableCell>
                                    <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>
                                        <IconButton onClick={event => this.showClusterDetails(row.cluster, this.props.monthA)}><ListIcon /></IconButton>
                                    </TableCell>
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