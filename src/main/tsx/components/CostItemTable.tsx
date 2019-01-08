import * as React from "react";
import CostItemModel from "../models/CostItemModel";
import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import CostEditDialog from "./CostEditDialog";
import { getRequest } from '../utils/rest';
import { getFromDetailedName } from '../utils/detailedClusters';

interface CostItemTableProps {
    items: CostItemModel[];
    title: string;
    updateCostItem: (changedItem: CostItemModel) => void;
}
export interface CostItemTableState {
    dialogOpen: boolean;
    costItem: CostItemModel;
    selections: {
        types: string[],
        detailedClusters: DetailedCostClusterModel[],
        clusters: string[],
    };
}
export default class CostItemTable extends React.Component<CostItemTableProps, CostItemTableState> {

    state = {
        costItem: new CostItemModel(),
        dialogOpen: false,
        selections: {
            types: new Array<string>(),
            detailedClusters: new Array<DetailedCostClusterModel>(),
            clusters: new Array<string>(),
        }
    }

    componentDidMount() {
        getRequest("/api/detailedCostClusters").then(r => {
            this.setState({ selections: Object.assign({}, this.state.selections, { detailedClusters: r.entity._embedded.detailedCostClusters }) })
        });
        getRequest("/api/types").then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { types: r.entity }) }) });
        getRequest("/api/clusters").then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { clusters: r.entity }) }) });
    }


    handleRowClick(event: React.MouseEvent<HTMLTableRowElement>, rowId: number) {
        this.setState({ costItem: this.initEmpty(this.getRowElement(this.props.items, rowId)) });
        this.changeDialogVisibility(true);
    }

    getRowElement(items: CostItemModel[], id: number): CostItemModel {
        for (let item of items) {
            if (item.id === id) {
                return item;
            }
        }

        return undefined;
    }

    changeDialogVisibility = (dialogOpen: boolean) => {
        this.setState({ dialogOpen: dialogOpen });
    }

    initEmpty(costItem: CostItemModel) {
        let newCostItem = costItem;

        if (newCostItem.detailedCluster === undefined) {
            newCostItem.detailedCluster = new DetailedCostClusterModel("", "");
        }

        if (newCostItem.detailedCluster.name === null) {
            newCostItem.detailedCluster = new DetailedCostClusterModel("", "");
        }

        if (newCostItem.type === null) {
            newCostItem.type = "";
        }

        return newCostItem;
    }

    updateValue = (newValue: string, field: string) => {
        switch (field) {
            case "type":
                this.setState({ costItem: Object.assign({}, this.state.costItem, { type: newValue }) });
                break;
            case "cluster":
                this.setState({
                    costItem:
                        Object.assign({}, this.state.costItem, { detailedCluster: new DetailedCostClusterModel(this.state.costItem.detailedCluster.name, newValue) })
                });
                break;
            case "detailedCluster":
                this.setState({ costItem: Object.assign({}, this.state.costItem, { detailedCluster: getFromDetailedName(newValue) }) });
                break;
            default:
                console.log("Do not know field: " + field);
        }
    }

    getStyle(item: CostItemModel) {
        if (item.validState) {
            return {};
        }
        return { backgroundColor: "#ff9333" };
    }

    render() {
        return (

            <div>
                <Typography variant="h5" component="h3">
                    {this.props.title}
                </Typography>
                <CostEditDialog dialogOpen={this.state.dialogOpen} costItem={this.state.costItem}
                    changeDialogVisibility={this.changeDialogVisibility} selections={this.state.selections} updateValue={this.updateValue} updateCostItem={this.props.updateCostItem} />

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
                            this.props.items.map(item => {
                                return (
                                    <TableRow style={this.getStyle(item)} key={item.id} hover onClick={event => this.handleRowClick(event, item.id)}>
                                        <TableCell>{item.creationDate.substring(0, 10)}</TableCell>
                                        <TableCell>{item.recipient.name}</TableCell>
                                        <TableCell>{item.amount + " €"}</TableCell>
                                        <TableCell>{item.owner}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.detailedCluster.cluster}</TableCell>
                                        <TableCell>{item.detailedCluster.name}</TableCell>
                                        <TableCell>{item.purpose}</TableCell>
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

