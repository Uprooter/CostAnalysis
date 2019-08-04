import * as React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CostItemModel from "../../models/CostItemModel";
import CostItemTableNew from "../util/CostItemTableNew";
import { Button } from "@material-ui/core";

interface ClusterDetailsDialogProps {
    clusterCosts: CostItemModel[];
    dialogOpen: boolean;
    changeDialogVisibility: (dialogOpen: boolean) => void;
    selectedCluster: string;
}
export default class ClusterDetailsDialog extends React.PureComponent<ClusterDetailsDialogProps> {

    render() {
        return (
            <Dialog
                PaperProps={{
                    style: {
                        minWidth: "90vw"
                    }
                }}
                disableBackdropClick
                disableEscapeKeyDown
                open={this.props.dialogOpen}
                onClose={() => { console.log("Close") }}>
                <DialogContent>
                    <CostItemTableNew title={"Details für Typ "+this.props.selectedCluster} items={this.props.clusterCosts} getValidationColor={() => { }} handleRowClick={() => { }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.changeDialogVisibility(false)} color="primary">Schließen</Button>
                </DialogActions>
            </Dialog >
        );
    }
}