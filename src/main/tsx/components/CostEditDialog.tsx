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
import { Select, Button } from '@material-ui/core';
import CostItemModel from "../models/CostItemModel";
import { withStyles } from '@material-ui/core';


interface CostEditDialogProps {
    dialogOpen: boolean;
    costItem: CostItemModel;
}

interface CostEditDialogState {
    clusters: string[];
    types: string[];
    detailedClusters: string[];
}
export default class CostEditDialog extends React.Component<CostEditDialogProps, CostEditDialogState> {

    state = {
        clusters: new Array<string>(),
        detailedClusters: new Array<string>(),
        types: new Array<string>(),
    }


    componentDidMount() {
        getRequest("/api/detailedClusterNames").then(r => { this.setState({ detailedClusters: r.entity }) });
        getRequest("/api/types").then(r => { this.setState({ types: r.entity }) });
    }

    detailedClusterSelected(detailedCluster: string) {
        getRequest("/api/clustersByDetailed?detailedCluster=" + detailedCluster).then(r => { this.setState({ clusters: r.entity }) });
    }

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
                        <FormControl style={{ marginRight: "50px" }}>
                            <InputLabel htmlFor="type-select">Kostenart</InputLabel>
                            <Select
                                style={{ width: "150px"}}
                                value={""}
                                onChange={e => { console.log("Change") }}
                                input={<Input id="type-select" />}>
                                {
                                    this.state.types.map(c => {
                                        return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl style={{ marginRight: "50px" }}>
                            <InputLabel htmlFor="detail-select">Detail</InputLabel>
                            <Select
                                style={{ width: "150px" }}
                                value={""}
                                onChange={e => { this.detailedClusterSelected(e.target.value) }}
                                input={<Input id="detail-select" />}>
                                {
                                    this.state.detailedClusters.map(c => {
                                        return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="cluster-select">Typ</InputLabel>
                            <Select
                                style={{ width: "150px" }}
                                value={""}
                                onChange={e => { console.log("Change") }}
                                input={<Input id="cluster-select" />}>
                                {
                                    this.state.clusters.map(c => {
                                        return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                    })
                                }
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => { console.log("OK") }} color="primary">Ok</Button>
                    <Button onClick={() => { console.log("Cancel") }} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

}

