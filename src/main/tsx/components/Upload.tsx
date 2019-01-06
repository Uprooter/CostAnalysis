import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";
import Button from '@material-ui/core/Button';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import CostItemModel from "../models/CostItemModel";
import CostItemTable from "./CostItemTable";

interface UploadProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
}
interface UploadState {
    mappedItems: CostItemModel[];
    unmappedItems: CostItemModel[];
}
export default class Upload extends React.Component<UploadProps, UploadState> {

    state = {
        mappedItems: new Array<CostItemModel>(),
        unmappedItems: new Array<CostItemModel>()
    }

    componentDidMount() {
        this.props.updatePageName(Page.UPLOAD.name)
    }

    isEmpty(str: string) {
        return (!str || 0 === str.length);
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
            let newMappedItems: CostItemModel[] = new Array<CostItemModel>();
            let newUnmappedItems: CostItemModel[] = new Array<CostItemModel>();
            for (let i in newImportedItems) {
                let item: CostItemModel = newImportedItems[i];
                item.id = Number.parseInt(i);

                if (this.isEmpty(item.type)) {
                    newUnmappedItems.push(item);
                }
                else {
                    newMappedItems.push(item);
                }
            }

            this.setState({ mappedItems: newMappedItems, unmappedItems: newUnmappedItems });
        });
    }

    saveUploadedItems() {
        console.log("Save");
    }

    updateCostItem = (changedItem: CostItemModel) => {

        // Dont know where changed item belongs to -> need to iterate through both lists
        let newUnmappedItems: CostItemModel[] = this.state.unmappedItems;
        for (let i in newUnmappedItems) {
            if (newUnmappedItems[i].id === changedItem.id) {
                newUnmappedItems[i] = changedItem;
            }
        }

        let newMappedItems: CostItemModel[] = this.state.mappedItems;
        for (let i in newMappedItems) {
            if (newMappedItems[i].id === changedItem.id) {
                newMappedItems[i] = changedItem;
            }
        }
    }

    render() {
        return (
            <div>
                <input
                    accept=".csv"
                    id="contained-button-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => this.readInFile(e.target.files[0])}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span">
                        Datei Hochladen
                    </Button>
                </label>

                <Button variant="contained" color="primary" onClick={() => this.saveUploadedItems()}>Speichern</Button>
                <CostItemTable items={this.state.unmappedItems} title={"Konnten nicht zugewiesen werden"} updateCostItem={this.updateCostItem} />
                <CostItemTable items={this.state.mappedItems} title={"Erfolgreich zugewiesen"} updateCostItem={this.updateCostItem} />
            </div>
        );
    }
}