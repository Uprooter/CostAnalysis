import * as React from "react";
import { DetailedCostClusterModel } from "../model/DetailedCostClusterModel";
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
import { Paper, TableBody, Button, TextField } from "@material-ui/core";
import * as rest from "rest";
import * as mime from "rest/interceptor/mime";


export interface DetailedCostClusterProps {
    detailedClusters: DetailedCostClusterModel[];
}

export interface DetailedCostClusterState {
    open: boolean;
    selectedCluster: string;
    clusters: string[];
}

export class DetailedCostCluster extends React.Component<DetailedCostClusterProps, DetailedCostClusterState> {

    constructor(props: DetailedCostClusterProps) {
        super(props)
        this.state = {
            selectedCluster: "",
            open: false,
            clusters: [],
        };
    }

    componentDidMount() {

        let client = rest.wrap(mime);
        client({ path: "/api/clusters" }).then(r => { this.setState({ clusters: r.entity }) });
    }


    handleClose(): void {
        this.setState({ open: false });
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleChange(event:any): void {
        this.setState({ selectedCluster: event.target.value });
    }
    render() {
        return (
            <Paper>
                <Button color="primary" onClick={this.handleOpen}>Create New</Button>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.open}
                    onClose={this.handleClose}>
                    <DialogTitle>Create new detailed cluster</DialogTitle>
                    <DialogContent>
                        <form >
                            <FormControl >
                                <InputLabel htmlFor="age-simple">Cluster</InputLabel>
                                <Select
                                    value={this.state.selectedCluster}
                                    onChange={e => this.handleChange(e)}
                                    input={<Input id="age-simple" />}>
                                    {
                                        this.state.clusters.map(c => {
                                            return (<MenuItem value={c}>{c}</MenuItem>);
                                        })
                                    }
                                </Select>
                                <TextField label="Name"></TextField>
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleClose} color="primary">Ok</Button>
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