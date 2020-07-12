import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import DetailedCostClusterModel from "../../models/DetailedCostClusterModel";
import { Select, Button, Grid, TextField } from '@material-ui/core';
import CostItemModel from "../../models/CostItemModel";
import { detailedName } from '../../utils/detailedClusters';

interface CostEditDialogProps {
    selections: {
        types: string[],
        detailedClusters: DetailedCostClusterModel[],
        clusters: string[],
    };
    dialogOpen: boolean;
    costItem: CostItemModel;
    changeDialogVisibility: (dialogOpen: boolean) => void;
    updateValue: (newValue: string, field: string, typeValue?: string) => void;
    updateCostItem: (changedItem: CostItemModel) => void;
}
interface CostEditDialogState {
    newDetailedCluster: DetailedCostClusterModel;
    errors: {
        typeError: boolean,
        detailedClusterCombinedError: boolean,
        clusterError: boolean
    }
}
export default class CostEditDialog extends React.Component<CostEditDialogProps, CostEditDialogState> {

    state = {
        newDetailedCluster: new DetailedCostClusterModel("", ""),
        errors: {
            typeError: false,
            detailedClusterCombinedError: false,
            clusterError: false
        }
    }

    handleSumbit(event: React.FormEvent) {
        if (this.hasErrors()) {
            event.preventDefault();
        }
        else {
            if (detailedName(this.props.costItem.detailedCluster) !== "") {
                this.props.updateCostItem(Object.assign({}, this.props.costItem, { duplicate: false, similar: false }));
            }
            else {
                this.props.updateCostItem(Object.assign({}, this.props.costItem, { detailedCluster: this.state.newDetailedCluster, duplicate: false, similar: false }));
            }
            this.props.changeDialogVisibility(false);
        }
    }

    hasErrors(): boolean {
        let typeIsMissing = this.props.costItem.type === "";
        let combinedMissing = detailedName(this.props.costItem.detailedCluster) === "";
        let newClusterMissing = this.state.newDetailedCluster.cluster === "";
        let detailedClusterMissing = newClusterMissing && combinedMissing;

        this.setState({
            errors: {
                typeError: typeIsMissing,
                detailedClusterCombinedError: detailedClusterMissing,
                clusterError: detailedClusterMissing
            }
        });

        return typeIsMissing || detailedClusterMissing;
    }

    setCostType(cluster: string, type: string, ): void {
    }

    render() {
        return (
            <Dialog
                PaperProps={{
                    style: {
                        minWidth: "40vw"
                    }
                }}
                disableBackdropClick
                disableEscapeKeyDown
                open={this.props.dialogOpen}
                onClose={() => { console.log("Close") }}>
                <DialogTitle>Details anpassen...</DialogTitle>
                <DialogContent>
                    <form onSubmit={e => this.handleSumbit(e)}>
                        <Grid container spacing={16}>
                            <Grid item>
                                <FormControl>
                                    <Button onClick={() => this.props.updateValue("VERPFLEGUNG / Lebensmittel", "detailedClusterAndType", "FLEXIBEL")}>
                                        Lebensmittel</Button>
                                    <Button onClick={() => this.props.updateValue("ALLGEMEIN / -", "detailedClusterAndType", "FLEXIBEL")}>Allgemein</Button>
                                    <Button onClick={() => this.props.updateValue("VERKEHRSMITTEL / Benzin", "detailedClusterAndType", "FLEXIBEL")}>Benzin</Button>
                                    <Button onClick={() => this.props.updateValue("FREIZEIT / -", "detailedClusterAndType", "FLEXIBEL")}>Freizeit</Button>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <Button onClick={() => this.props.updateValue("KIND / -", "detailedClusterAndType", "FLEXIBEL")}>Kind</Button>
                                    <Button onClick={() => this.props.updateValue("HW_MOEBEL / -", "detailedClusterAndType", "FLEXIBEL")}>HW Moebel</Button>
                                    <Button onClick={() => this.props.updateValue("BEKLEIDUNG / -", "detailedClusterAndType", "FLEXIBEL")}>Bekleidung</Button>
                                    <Button onClick={() => this.props.updateValue("GESUNDHEIT / -", "detailedClusterAndType", "FLEXIBEL")}>Gesundheit</Button>
                                    <Button onClick={() => this.props.updateValue("GEHALT / -", "detailedClusterAndType", "GEHALT")}>Gehalt</Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="type-select">Kostenart</InputLabel>
                                    <Select
                                        style={{ width: "200px" }}
                                        error={this.state.errors.typeError}
                                        value={this.props.costItem.type}
                                        onChange={e => { this.props.updateValue(e.target.value, "type") }}
                                        input={<Input id="type-select" />}>
                                        {
                                            this.props.selections.types.map(c => {
                                                return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="cluster-select">Typ/Detail</InputLabel>
                                    <Select
                                        style={{ width: "300px" }}
                                        error={this.state.errors.detailedClusterCombinedError}
                                        value={detailedName(this.props.costItem.detailedCluster)}
                                        onChange={e => { this.props.updateValue(e.target.value, "detailedCluster") }}
                                        input={<Input id="detailed-cluster-select" />}>
                                        {
                                            this.props.selections.detailedClusters.map(c => {
                                                return (<MenuItem key={c._links.self.href} value={detailedName(c)}>{detailedName(c)}</MenuItem>);
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="cluster-select">Typ</InputLabel>
                                    <Select
                                        style={{ width: "200px" }}
                                        error={this.state.errors.clusterError}
                                        value={this.state.newDetailedCluster.cluster}
                                        onChange={e => {
                                            this.setState({ newDetailedCluster: new DetailedCostClusterModel(this.state.newDetailedCluster.name, e.target.value) })
                                        }}
                                        input={<Input id="cluster-select" />}>
                                        {
                                            this.props.selections.clusters.map(c => {
                                                return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <TextField label="Detail" onChange={e => {
                                        this.setState({ newDetailedCluster: new DetailedCostClusterModel(e.target.value, this.state.newDetailedCluster.cluster) })
                                    }}>{this.state.newDetailedCluster.name}</TextField>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => this.handleSumbit(e)} color="primary">Ok</Button>
                    <Button onClick={() => this.props.changeDialogVisibility(false)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog >
        );
    }
}