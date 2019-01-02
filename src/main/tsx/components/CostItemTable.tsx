import * as React from "react";
import CostItemModel from "../models/CostItemModel";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import CostEditDialog from "./CostEditDialog";

interface CostItemTableProps {
    items: CostItemModel[];
    title: string;
}
export interface CostItemTableState {
    costItem: CostItemModel,
    dialogOpen: boolean
}
export default class CostItemTable extends React.Component<CostItemTableProps, CostItemTableState> {
    state = {
        costItem: new CostItemModel(),
        dialogOpen: false
    }

    handleRowClick(event: React.MouseEvent<HTMLTableRowElement>, rowId: number) {
        this.setState({ dialogOpen: true });
    }

    render() {
        return (

            <div>
                <Typography variant="h5" component="h3">
                    {this.props.title}
                </Typography>
                <CostEditDialog dialogOpen={this.state.dialogOpen} costItem={this.state.costItem} />

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

