import * as React from "react";
import CostItemModel from "../../models/CostItemModel";
import DetailedCostClusterModel from "../../models/DetailedCostClusterModel";
import CostItemTable from "../util/CostItemTable";
import { Typography } from '@material-ui/core';
import CostEditDialog from "../upload/CostEditDialog";
import { getRequest } from '../../utils/rest';
import { getFromDetailedName } from '../../utils/detailedClusters';
import { parseISOString } from "../../utils/dates";

interface EditableCostItemTableProps {
    items: CostItemModel[];
    title: string;
    updateCostItem: (changedItem: CostItemModel) => void;
}
export interface EditableCostItemTableState {
    dialogOpen: boolean;
    costItem: CostItemModel;
    selections: {
        types: string[],
        detailedClusters: DetailedCostClusterModel[],
        clusters: string[],
    };
}
export default class EditableCostItemTable extends React.Component<EditableCostItemTableProps, EditableCostItemTableState> {

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
        getRequest("/types").then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { types: r.entity }) }) });
        getRequest("/clusters").then(r => { this.setState({ selections: Object.assign({}, this.state.selections, { clusters: r.entity }) }) });
    }


    handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, rowId: number) => {
        this.setState({ costItem: this.initEmpty(this.getRowElement(this.props.items, rowId)) });
        this.changeDialogVisibility(true);
    }

    getRowElement(items: CostItemModel[], id: number): CostItemModel {
        for (let item of items) {
            if (item.clientId === id) {
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

    updateValue = (newValue: string, field: string, typeValue?: string) => {
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
            case "detailedClusterAndType":
                this.setState({ costItem: Object.assign({}, this.state.costItem, { detailedCluster: getFromDetailedName(newValue), type: typeValue }) });
                break;
            case "creationDate":
                this.setState({ costItem: Object.assign({}, this.state.costItem, { creationDate: newValue}) });
                break;
            default:
                console.log("Do not know field: " + field);
        }
    }

    getValidationColor(item: CostItemModel) {

        if (!item.complete) {
            return { backgroundColor: "#FFA833" };
        }

        if (item.duplicate) {
            return { backgroundColor: "#FF5B33" };
        }

        if (item.similar) {
            return { backgroundColor: "#FFD133" };
        }
        return {};
    }

    render() {
        return (

            <React.Fragment>
                <Typography variant="h5" component="h3">
                    {this.props.title}
                </Typography>
                <CostEditDialog dialogOpen={this.state.dialogOpen} costItem={this.state.costItem}
                    changeDialogVisibility={this.changeDialogVisibility} selections={this.state.selections}
                    updateValue={this.updateValue} updateCostItem={this.props.updateCostItem} />

                <CostItemTable getValidationColor={this.getValidationColor} handleRowClick={this.handleRowClick} items={this.props.items} />
            </React.Fragment>
        );
    }
}

