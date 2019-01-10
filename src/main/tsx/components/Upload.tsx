import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";
import Button from '@material-ui/core/Button';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import CostItemModel from "../models/CostItemModel";
import DuplicateItemModel from "../models/DuplicateItemModel";
import CostItemTable from "./CostItemTable";
import { getDateString, parseISOString } from "../utils/dates";

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
            path: "/upload",
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
                let item: CostItemModel = Object.assign({}, newImportedItems[i], { validState: true });
                item.clientId = Number.parseInt(i);

                if (this.isEmpty(item.type)) {
                    item.validState = false;
                    newUnmappedItems.push(item);
                }
                else {
                    newMappedItems.push(item);
                }
            }

            this.setState({ mappedItems: newMappedItems, unmappedItems: newUnmappedItems });
        });
    }

    anyErrorsFound(): boolean {
        let anyErrorFound: boolean = false;
        for (let item of this.state.mappedItems.concat(this.state.unmappedItems)) {
            if (!item.validState) {
                anyErrorFound = true;
                break;
            }
        }

        return anyErrorFound;
    }
    saveUploadedItems() {

        if (this.anyErrorsFound()) {
            window.alert("Fix errors first");
            return;
        }

        let itemsToSave = this.state.mappedItems.concat(this.state.unmappedItems);
        let client = rest.wrap(mime);
        client({
            path: "/upload/save",
            method: "POST",
            entity: { "correctedItems": itemsToSave },
            headers: { 'Content-Type': 'application/json' }
        }).done(response => {
            if (response.status.code === 409) {
                alert("Error occurred: " + response.entity.message);
            }
            else {
                console.log("Save Done:", response.entity);
                let potentialDuplicates: Array<DuplicateItemModel> = response.entity;
                for (let item of potentialDuplicates) {
                    let dublicateItem = item.clientItem;
                    dublicateItem.validState = false;
                    this.updateCostItem(dublicateItem);
                }
            }
        });
    }

    updateCostItem = (changedItem: CostItemModel) => {
        // Dont know where changed item belongs to -> need to iterate through both lists
        let newUnmappedItems: CostItemModel[] = JSON.parse(JSON.stringify(this.state.unmappedItems));
        for (let i in newUnmappedItems) {
            if (newUnmappedItems[i].clientId === changedItem.clientId) {
                newUnmappedItems[i] = changedItem;
            }
        }

        let newMappedItems: CostItemModel[] = JSON.parse(JSON.stringify(this.state.mappedItems));
        for (let i in newMappedItems) {
            if (newMappedItems[i].clientId === changedItem.clientId) {
                newMappedItems[i] = changedItem;
            }
        }

        this.setState({ mappedItems: newMappedItems, unmappedItems: newUnmappedItems });
    }

    updateCostItemWithState = (changedItem: CostItemModel) => {
        changedItem.validState = (changedItem.type !== ""
            && changedItem.type !== undefined
            && changedItem.detailedCluster !== undefined
            && changedItem.detailedCluster.cluster !== "");

        this.updateCostItem(changedItem);
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
                <CostItemTable items={this.state.unmappedItems} title={"Konnten nicht zugewiesen werden"} updateCostItem={this.updateCostItemWithState} />
                <CostItemTable items={this.state.mappedItems} title={"Erfolgreich zugewiesen"} updateCostItem={this.updateCostItemWithState} />
            </div>
        );
    }
}