import * as React from "react";
import CostItemModel from "../../models/CostItemModel";
import MUIDataTable from "mui-datatables";
import { getDEDateString } from "../../utils/dates";

interface CostItemTableProps {
    title: string;
    items: CostItemModel[];
    handleRowClick: (event: React.MouseEvent<HTMLTableRowElement>, rowId: number) => void;
    getValidationColor: (item: CostItemModel) => any;
}

export default class CostItemTableNew extends React.PureComponent<CostItemTableProps> {

    render() {
        return (
            <MUIDataTable
                title={this.props.title}
                columns={[
                    {
                        name: "creationDate",
                        label: "Buchungstag",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "recipient",
                        label: "Empfänger",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "amount",
                        label: "Betrag",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "owner",
                        label: "Wer",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "type",
                        label: "Kostenart",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "cluster",
                        label: "Typ",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "detail",
                        label: "Detail",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                    {
                        name: "purpose",
                        label: "Verwendungszweck",
                        options: {
                            filter: true,
                            sort: true,
                        }
                    },
                ]}

                options={{pagination:false}}

                data={this.props.items.map(item => {
                    return (
                        {
                            creationDate: getDEDateString(item.creationDate),
                            recipient: item.recipient.name,
                            amount: item.amount,
                            owner: item.owner,
                            type: item.type,
                            cluster: item.detailedCluster.cluster,
                            detail: item.detailedCluster.name,
                            purpose: item.purpose
                        }
                    );
                })} />
        );
    }
}

