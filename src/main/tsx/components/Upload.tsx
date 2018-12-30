import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";
import Button from '@material-ui/core/Button';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import CostItemModel from "../models/CostItemModel";
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

interface UploadProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
}
interface UploadState {
    importedItems: CostItemModel[];
}
export default class Upload extends React.Component<UploadProps, UploadState> {

    state = {
        importedItems: new Array<CostItemModel>()
    }

    componentDidMount() {
        this.props.updatePageName(Page.UPLOAD.name)
    }

    readInFile(file: File) {
        let client = rest.wrap(mime);
        client({
            path: "/api/upload",
            entity: { "file": file },
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: "POST"
        }).then(r => {
            let newImportedItems: CostItemModel[] = r.entity;
            let newState: CostItemModel[] = new Array<CostItemModel>();
            for (let i in newImportedItems) {
                let item: CostItemModel = newImportedItems[i];
                item.id = Number.parseInt(i);
                newState.push(item)
            }

            this.setState({ importedItems: newState });
        });
    }

    render() {
        return (
            <div>
                <input
                    accept=".csv"
                    id="contained-button-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => { this.readInFile(e.target.files[0]) }}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label>

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
                            this.state.importedItems.map(row => {
                                return (
                                    <TableRow key={row.id}>
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