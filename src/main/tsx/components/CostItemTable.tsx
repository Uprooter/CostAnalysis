import * as React from "react";
import CostItemModel from "../models/CostItemModel";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DetailedCostClusterModel from "../models/DetailedCostClusterModel";

interface CostItemTableProps {
    items: CostItemModel[];
    title: string;
}
export interface CostItemTableState {
    clusters: string[];
    types: string[];
    detailedClusters: DetailedCostClusterModel[];
    dialogOpen:boolean;
}
export default class CostItemTable extends React.Component<CostItemTableProps, CostItemTableState> {
    state = {
        clusters: new Array<string>(),
        detailedClusters: new Array<DetailedCostClusterModel>(),
        types: new Array<string>(),
        dialogOpen: false
    }

    componentDidMount() {
        let client = rest.wrap(mime);
        client({ path: "/api/detailedClusters" }).then(r => { this.setState({ clusters: r.entity }) });
        client({ path: "/api/clusters" }).then(r => { this.setState({ clusters: r.entity }) });
        client({ path: "/api/types" }).then(r => { this.setState({ types: r.entity }) });
    }

    render() {
        return (

            <div>
                <Typography variant="h5" component="h3">
                    {this.props.title}
                </Typography>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.dialogOpen}
                    onClose={() => { console.log("Close")}}>
                    <DialogTitle>Create new detailed cluster</DialogTitle>
                    <DialogContent>
                        <form onSubmit={e => { console.log("Submit")}}>
                            <FormControl>
                                <InputLabel htmlFor="type-select">Type</InputLabel>
                                <Select
                                    value={this.state.selectedCluster}
                                    error={}
                                    onChange={e => { console.log("Submit")}}
                                    input={<Input id="type-select" />}>
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
                                    <TableRow key={row.id}>
                                        <TableCell>{row.creationDate.substring(0, 10)}</TableCell>
                                        <TableCell>{row.recipient.name}</TableCell>
                                        <TableCell>{row.amount + " €"}</TableCell>
                                        <TableCell>{row.owner}</TableCell>
                                        <TableCell>
                                            <Select
                                                native
                                                value={row.type}
                                                onChange={() => { console.log() }}
                                                inputProps={{
                                                    name: 'type',
                                                    id: 'type-native-simple',
                                                }}>
                                                {
                                                    this.state.types.map(c => {
                                                        return (<option value={c}>{c}</option>);
                                                    })
                                                }
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                native
                                                value={row.detailedCluster.cluster}
                                                onChange={() => { console.log() }}
                                                inputProps={{
                                                    name: 'cluster',
                                                    id: 'cluster-native-simple',
                                                }}>
                                                {
                                                    this.state.clusters.map(c => {
                                                        return (<option value={c}>{c}</option>);
                                                    })
                                                }
                                            </Select>
                                        </TableCell>
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

