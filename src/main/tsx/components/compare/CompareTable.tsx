import * as React from "react";
import CompareModel from "../../models/CompareModel";
import ClusterDetailsDialog from "../analysis/ClusterDetailsDialog";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import {toRoundEuroString} from "../../utils/numbers";
import {getRequest} from '../../utils/rest';
import CostItemModel from "../../models/CostItemModel";
import YearMonth from "../../models/YearMonth";
import ListIcon from '@material-ui/icons/List';
import IconButton from '@material-ui/core/IconButton';
import {getDateString, getDateWithLastDayOfSameMonth} from "../../utils/dates";

interface CompareTableProps {
    clusterCompareItems: CompareModel[];
    monthA: YearMonth;
    monthB: YearMonth;
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

    showClusterDetails = (cluster: string, date: YearMonth) => {
        this.setState({selectedCluster: cluster}, () => this.changeDialogVisibility(true));

        let from: Date = new Date(date.year, date.month, 1);
        let to: Date = getDateWithLastDayOfSameMonth(from);
        getRequest("/clusterCostsByCluster?from=" + getDateString(from) //1.month.year
            + "&to=" + getDateString(getDateWithLastDayOfSameMonth(to)) // last day of month
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
        this.setState({selectedClusterCosts: costsWithClientId});
    }

    changeDialogVisibility = (dialogOpen: boolean) => {
        this.setState({dialogOpen: dialogOpen});
    }

    render() {
        return (
            <React.Fragment>
                <Typography variant="h5" component="h3" style={{marginBottom: 5}}>
                    Vergleich von {this.props.monthA.getRestString()} zu {this.props.monthB.getRestString()}
                </Typography>

                <ClusterDetailsDialog
                    dialogOpen={this.state.dialogOpen}
                    selectedCluster={this.state.selectedCluster}
                    changeDialogVisibility={this.changeDialogVisibility}
                    clusterCosts={this.state.selectedClusterCosts}/>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Typ</TableCell>
                            <TableCell>Unterschied</TableCell>
                            <TableCell style={{
                                paddingLeft: 10,
                                paddingRight: 10
                            }}>Details {this.props.monthA.getRestString()}</TableCell>
                            <TableCell style={{
                                paddingLeft: 10,
                                paddingRight: 10
                            }}>Details {this.props.monthA.getRestString()}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.clusterCompareItems.map(row => {
                            return (
                                <TableRow key={row.cluster}>
                                    <TableCell>{row.cluster}</TableCell>
                                    <TableCell>{toRoundEuroString(row.change)}</TableCell>
                                    <TableCell style={{paddingLeft: 10, paddingRight: 10}}>
                                        <IconButton
                                            onClick={event => this.showClusterDetails(row.cluster, this.props.monthA)}><ListIcon/></IconButton>
                                    </TableCell>
                                    <TableCell style={{paddingLeft: 10, paddingRight: 10}}>
                                        <IconButton
                                            onClick={event => this.showClusterDetails(row.cluster, this.props.monthA)}><ListIcon/></IconButton>
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
