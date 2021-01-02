import * as React from "react";
import CostItemModel from "../../models/CostItemModel";
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { getDEDateString} from "../../utils/dates";

interface CostItemTableProps {
    items: CostItemModel[];
    handleRowClick: (event: React.MouseEvent<HTMLTableRowElement>, rowId: number) => void;
    getValidationColor: (item: CostItemModel) => any;
}

export default class CostItemTable extends React.PureComponent<CostItemTableProps> {

    render() {
        return (
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
                                <TableRow style={this.props.getValidationColor(item)}
                                    key={item.clientId} hover
                                    onClick={event => this.props.handleRowClick(event, item.clientId)}>
                                    <TableCell>{item.creationDate}</TableCell>
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
        );
    }
}

