import * as React from "react";
import DetailedCostClusterModel from "../../models/DetailedCostClusterModel";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { Paper, TableBody, Button, TextField } from '@material-ui/core';

import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';

export interface DetailedCostClusterProps {
    detailedClusters: DetailedCostClusterModel[];
}

export interface DetailedCostClusterState {
    open: boolean;
    selectedCluster: string;
    clusters: string[];
    newDetailedClusterName: string;
    nameMissing: boolean;
    clusterMissing: boolean;
}

export default class DetailedCostCluster extends React.Component<DetailedCostClusterProps, DetailedCostClusterState> {

    constructor(props: DetailedCostClusterProps) {
        super(props)
        this.state = {
            selectedCluster: "",
            open: false,
            clusters: [],
            newDetailedClusterName: "",
            nameMissing: false,
            clusterMissing: false,
        };
    }

    componentDidMount() {
        // let client = rest.wrap(mime);
        // client({ path: "/api/clusters" }).then(r => { this.setState({ clusters: r.entity }) });

        //  let client = rest.wrap(mime);
        // client({ path: "/api/clusters" }).then(r => { 
        //     this.props.onAddDetailedCluster });
    }

    createNewAndReload(event: React.FormEvent) {

        let nameMissing = this.state.newDetailedClusterName === "";
        let clusterMissing = this.state.selectedCluster === "";
        let anythingMissing = nameMissing || clusterMissing;
        if (anythingMissing === true) {
            this.setState({ nameMissing: nameMissing, clusterMissing: clusterMissing });
            event.preventDefault();
        }
        else {

            let client = rest.wrap(mime);
            client({
                path: "/api/detailedCostClusters",
                method: "POST",
                entity: { "cluster": this.state.selectedCluster, "name": this.state.newDetailedClusterName },
                headers: { 'Content-Type': 'application/json' }
            }).done(response => {
                if (response.status.code === 409) {
                    alert("Error occurred: " + response.entity.message);
                }
                else {
                    this.setState({ open: false });
                    location.reload();
                }
            });
        }
    }


    handleClose(): void {
        this.setState({ open: false });
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleChange(event: any): void {
        this.setState({ selectedCluster: event.target.value });
    }
    render() {

        return (
            <Paper>
                <Button color="primary" onClick={() => { this.handleOpen() }}>Create New</Button>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.open}
                    onClose={() => { this.handleClose() }}>
                    <DialogTitle>Create new detailed cluster</DialogTitle>
                    <DialogContent>
                        <form onSubmit={e => { this.createNewAndReload(e) }}>
                            <FormControl>
                                <InputLabel htmlFor="age-simple">Cluster</InputLabel>
                                <Select
                                    value={this.state.selectedCluster}
                                    error={this.state.clusterMissing}
                                    onChange={e => this.handleChange(e)}
                                    input={<Input id="age-simple" />}>
                                    {
                                        this.state.clusters.map(c => {
                                            return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                        })
                                    }
                                </Select>
                                <TextField label="Name"
                                    onChange={e => { this.setState({ newDetailedClusterName: e.target.value }) }}
                                    error={this.state.nameMissing}
                                    required></TextField>
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={e => { this.createNewAndReload(e) }} color="primary">Ok</Button>
                        <Button onClick={() => { this.handleClose() }} color="primary">Cancel</Button>
                    </DialogActions>
                </Dialog>

                <Button color="primary">Save</Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cluster</TableCell>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.detailedClusters.map(row => {
                            return (
                                <TableRow key={row.name}>
                                    <TableCell>{row.cluster}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                </TableRow>
                            );
                        })
                        }
                    </TableBody>

                </Table>
            </Paper >
        );
    }
}