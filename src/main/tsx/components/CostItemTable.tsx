import * as React from "react";
import CostItemModel from "../models/CostItemModel";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import CostEditDialog from "./CostEditDialog";
import { getRequest } from '../utils/rest';

interface CostItemTableProps {
    items: CostItemModel[];
    title: string;
}
export interface CostItemTableState {
    dialogOpen: boolean;
    costItem: CostItemModel;
    selections: {
        types: string[],
        detailedClusters: string[],
        clusters: string[],
    };
}
export default class CostItemTable extends React.Component<CostItemTableProps, CostItemTableState> {

    state = {
        costItem: new CostItemModel(),
        dialogOpen: false,
        selections: {
            types: new Array<string>(),
            detailedClusters: new Array<string>(),
            clusters: new Array<string>(),
        }
    }

    componentDidMount() {
        getRequest("/api/detailedClusterNames").then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { detailedClusters: r.entity }) }) });
        getRequest("/api/types").then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { types: r.entity }) }) });
    }


    handleRowClick(event: React.MouseEvent<HTMLTableRowElement>, rowId: number) {
        this.setState({ costItem: this.initEmpty(this.props.items[rowId]) }, () => this.detailedClusterSelected());
        this.changeDialogVisibility(true);
    }

    changeDialogVisibility = (dialogOpen: boolean) => {
        this.setState({ dialogOpen: dialogOpen });
    }

    // need to set it already here an pass it to the dialog otherwise the current cluster value will not be displayed in the selection box
    detailedClusterSelected() {
        if (this.state.costItem.detailedCluster.name !== "") {
            getRequest(encodeURI("/api/clustersByDetailed?detailedCluster=" + encodeURIComponent(this.state.costItem.detailedCluster.name)))
                .then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { clusters: r.entity }) }) });
        }
        else {
            this.setState({ selections: Object.assign({}, this.state.selections, { clusters: [this.state.costItem.detailedCluster.cluster] }) })
        }
    }

    initEmpty(costItem: CostItemModel) {
        let newCostItem = costItem;
        if (newCostItem.detailedCluster.name === null) {
            newCostItem.detailedCluster = { "name": "", "cluster": "" };
        }

        if (newCostItem.type === null) {
            newCostItem.type="";
        }

        return newCostItem;
    }

    updateValue = (newValue: string, field: string) => {
        switch (field) {
            case "type":
                this.setState({ costItem: Object.assign({}, this.state.costItem, { type: newValue }) });
                break;
            case "cluster":
                this.setState({ costItem: { ...this.state.costItem, detailedCluster: { name: this.state.costItem.detailedCluster.name, cluster: newValue } } });
                break;
            case "detailedCluster":
                this.setState({ costItem: { ...this.state.costItem, detailedCluster: { name: newValue, cluster: this.state.costItem.detailedCluster.cluster } } }, 
                                () => this.detailedClusterSelected());
                break;
            default:
                console.log("Do not know field: " + field);
        }
    }

    render() {
        return (

            <div>
                <Typography variant="h5" component="h3">
                    {this.props.title}
                </Typography>
                <CostEditDialog dialogOpen={this.state.dialogOpen} costItem={this.state.costItem}
                    changeDialogVisibility={this.changeDialogVisibility} selections={this.state.selections} updateValue={this.updateValue} />

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Buchungstag</TableCell>
                            <TableCell>Empfänger</TableCell>
                            <TableCell>Betrag</TableCell>
                            <TableCell>Wer</TableCell>
                            <TableCell>Kostenart</TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Detail</TableCell>
                            <TableCell>Verwendungszweck</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.props.items.map(row => {
                                return (
                                    <TableRow key={row.id} hover onClick={event => this.handleRowClick(event, row.id)}>
                                        <TableCell>{row.creationDate.substring(0, 10)}</TableCell>
                                        <TableCell>{row.recipient.name}</TableCell>
                                        <TableCell>{row.amount + " €"}</TableCell>
                                        <TableCell>{row.owner}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.detailedCluster.cluster}</TableCell>
                                        <TableCell>{row.detailedCluster.name}</TableCell>
                                        <TableCell>{row.purpose}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

