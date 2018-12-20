import * as React from "react";
import { NavigatioPageUpdateAction, AddCostItemsAction } from "../actions/actions";
import Page from "../utils/pages";
import { fetchCostItems } from "../utils/rest";
import CostItemModel from "../models/CostItemModel";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    addCostItems: (newItems: CostItemModel[]) => AddCostItemsAction;
    costItems: CostItemModel[];
}
export default class CostOverview extends React.Component<CostOverviewProps, {}> {

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
        
    }


    render() {

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Owner</TableCell>
                        <TableCell>Cluster</TableCell>
                        <TableCell>Detailed Cluster</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Recipient</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.costItems.map(row => {
                        return (
                            <TableRow key={row.owner}>
                                <TableCell>{row.owner}</TableCell>
                                <TableCell>{row.detailedCluster.cluster}</TableCell>
                                <TableCell>{row.detailedCluster.name}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.amount}</TableCell>
                                <TableCell>{row.recipient.name}</TableCell>
                            </TableRow>
                        );
                    })
                    }
                </TableBody>

            </Table>
        );
    }
}