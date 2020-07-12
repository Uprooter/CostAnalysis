import * as React from "react";
import { useState, useEffect } from "react";
import CompareModel from "../../models/CompareModel";
import ClusterDetailsDialog from "../analysis/ClusterDetailsDialog";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { toRoundEuroString } from "../../utils/numbers";
import { getRequest } from '../../utils/rest';
import CostItemModel from "../../models/CostItemModel";
import YearMonth from "../../models/YearMonth";
import ListIcon from '@material-ui/icons/List';
import IconButton from '@material-ui/core/IconButton';
import { getDateString, getDateWithLastDayOfSameMonth } from "../../utils/dates";

interface Props {
    monthA: YearMonth;
    monthB: YearMonth;
}

const CompareTable: React.FC<Props> = ({ monthA, monthB }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [clusterCompareItems, setClusterCompareItems] = useState<Array<CompareModel>>(new Array<CompareModel>());
    const [selectedCluster, setSelectedCluster] = useState<string>("");
    const [selectedClusterCosts, setSelectedClusterCosts] = useState<Array<CostItemModel>>(new Array<CostItemModel>());

    const loadClusterCompare = () => {
        getRequest("/compareClusterCosts?"
            + "monthA=" + monthA.getRestString()
            + "&monthB=" + monthB.getRestString())
            .then(r => { setClusterCompareItems(r.entity); });
    }

    useEffect(() => {
        loadClusterCompare();
    }, [monthA, monthB]);

    useEffect(() => {
        if (selectedCluster) {
            setDialogOpen(true)
        }
    }, [selectedCluster,selectedClusterCosts]);

    const showClusterDetails = (cluster: string, date: YearMonth) => {   

        let from: Date = new Date(date.year, date.month.number, 1);
        let to: Date = getDateWithLastDayOfSameMonth(from);
        getRequest("/clusterCostsByCluster?from=01." +date.getRestString() //1.month.year
            + "&to=" + getDateString(to) // last day of month
            + "&clusterName=" + cluster)
            .then(r => {
                console.log(r)
                updateSelectedClusterCostsWithClientId(r.entity);
                setSelectedCluster(cluster);
            });
    }

    const updateSelectedClusterCostsWithClientId = (selectedClusterCosts: CostItemModel[]) => {
        let costsWithClientId: CostItemModel[] = new Array<CostItemModel>();
        for (let i in selectedClusterCosts) {
            let item: CostItemModel = selectedClusterCosts[i];
            item.clientId = item.id;
            costsWithClientId.push(item);
        }
        setSelectedClusterCosts(costsWithClientId);
    }

    const changeDialogVisibility = (dialogOpen: boolean) => {
        setDialogOpen(dialogOpen);
    }

    return (
        <React.Fragment>
            <Typography variant="h5" component="h3" style={{ marginBottom: 5 }}>
                Vergleich von {monthA.getRestString()} zu {monthB.getRestString()}
            </Typography>

            <ClusterDetailsDialog
                dialogOpen={dialogOpen}
                selectedCluster={selectedCluster}
                changeDialogVisibility={changeDialogVisibility}
                clusterCosts={selectedClusterCosts} />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Typ</TableCell>
                        <TableCell>Unterschied (Von-Bis)</TableCell>
                        <TableCell style={{
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>Details {monthA.getRestString()}</TableCell>
                        <TableCell style={{
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>Details {monthB.getRestString()}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clusterCompareItems.map(row => {
                        return (
                            <TableRow key={row.cluster}>
                                <TableCell>{row.cluster}</TableCell>
                                <TableCell>{toRoundEuroString(row.change)}</TableCell>
                                <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <IconButton
                                        onClick={event => showClusterDetails(row.cluster, monthA)}><ListIcon /></IconButton>
                                </TableCell>
                                <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <IconButton
                                        onClick={event => showClusterDetails(row.cluster, monthB)}><ListIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })
                    }
                </TableBody>
            </Table>
        </React.Fragment>
    );

};

export default CompareTable;
