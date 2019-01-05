import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { getRequest } from '../utils/rest';
import { Select, Button, Grid } from '@material-ui/core';
import CostItemModel from "../models/CostItemModel";


interface CostEditDialogProps {
    selections: {
        types: string[],
        detailedClusters: string[],
        clusters: string[],
    };
    dialogOpen: boolean;
    costItem: CostItemModel;
    changeDialogVisibility: (dialogOpen: boolean) => void;
    updateValue: (newValue: string, field: string) => void;
}
export default class CostEditDialog extends React.Component<CostEditDialogProps, {}> {

    render() {
        return (
            <Dialog
                PaperProps={{
                    style: {
                        minWidth: "30vw"
                    }
                }}
                disableBackdropClick
                disableEscapeKeyDown
                open={this.props.dialogOpen}
                onClose={() => { console.log("Close") }}>
                <DialogTitle>Details anpassen...</DialogTitle>
                <DialogContent>
                    <form onSubmit={e => { console.log("Submit") }}>
                        <Grid container spacing={16}>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="type-select">Kostenart</InputLabel>
                                    <Select
                                        style={{ width: "150px" }}
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
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="cluster-select">Typ</InputLabel>
                                    <Select
                                        style={{ width: "200px" }}
                                        value={this.props.costItem.detailedCluster.cluster}
                                        onChange={e => { this.props.updateValue(e.target.value, "cluster") }}
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
                                    <InputLabel htmlFor="detail-select">Detail</InputLabel>
                                    <Select
                                        style={{ width: "150px" }}
                                        value={this.props.costItem.detailedCluster.name}
                                        onChange={e => { this.props.updateValue(e.target.value, "detailedCluster") }}
                                        input={<Input id="detail-select" />}>
                                        {
                                            this.props.selections.detailedClusters.map(c => {
                                                return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { console.log("OK") }} color="primary">Ok</Button>
                    <Button onClick={() => { this.props.changeDialogVisibility(false) }} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

}

