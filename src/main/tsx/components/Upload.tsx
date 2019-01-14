import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";
import Button from '@material-ui/core/Button';
import { SnackbarProvider, withSnackbar, InjectedNotistackProps, VariantType } from 'notistack';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import CostItemModel from "../models/CostItemModel";
import DuplicateItemModel from "../models/DuplicateItemModel";
import CostItemTable from "./CostItemTable";


interface UploadState {
    mappedItems: CostItemModel[];
    unmappedItems: CostItemModel[];
}
class Upload extends React.Component<InjectedNotistackProps, UploadState> {

    state = {
        mappedItems: new Array<CostItemModel>(),
        unmappedItems: new Array<CostItemModel>()
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
                let item: CostItemModel = Object.assign({}, newImportedItems[i], { complete: true, duplicate: false, similar: false });
                item.clientId = Number.parseInt(i);

                if (this.isEmpty(item.type)) {
                    item.complete = false;
                    newUnmappedItems.push(item);
                }
                else {
                    newMappedItems.push(item);
                }
            }
            this.setState({ mappedItems: newMappedItems, unmappedItems: newUnmappedItems });
        });
    }

    anyItemIncomplete(): boolean {
        for (let item of this.state.mappedItems.concat(this.state.unmappedItems)) {
            if (!item.complete) {
                return true;
            }
        }

        return false;
    }

    anyItemDuplicate(): boolean {
        for (let item of this.state.mappedItems.concat(this.state.unmappedItems)) {
            if (item.duplicate) {
                return true;
            }
        }

        return false;
    }

    saveUploadedItems() {

        if (this.anyItemIncomplete()) {
            this.displayMessage("Zuerst vervollständigen!", "error");
            return;
        }

        if (this.anyItemDuplicate()) {
            this.displayMessage("Zuerst die Duplikate entfernen!", "error");
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
                this.displayMessage("Error occurred: " + response.entity.message, "error");
            }
            else {
                let potentialDuplicates: Array<DuplicateItemModel> = response.entity;
                for (let item of potentialDuplicates) {
                    let dublicateItem = item.clientItem;
                    dublicateItem.complete = true;

                    if (item.duplicateItem !== null) {

                        dublicateItem.duplicate = true;
                    }

                    if (item.similarItem !== null) {
                        dublicateItem.similar = true;
                    }

                    this.updateCostItem(dublicateItem);
                }

                this.displayMessage("Gespeichert!", "success");

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
        changedItem.complete = (changedItem.type !== ""
            && changedItem.type !== undefined
            && changedItem.detailedCluster !== undefined
            && changedItem.detailedCluster.cluster !== "");

        this.updateCostItem(changedItem);
    }

    displayMessage(message: string, variant: any) {
        this.props.enqueueSnackbar(message, { variant });
    };

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

                <Button variant="contained" color="primary" onClick={() => { this.saveUploadedItems() }}>Speichern</Button>
                <CostItemTable items={this.state.unmappedItems} title={"Konnten nicht zugewiesen werden"} updateCostItem={this.updateCostItemWithState} />
                <CostItemTable items={this.state.mappedItems} title={"Erfolgreich zugewiesen"} updateCostItem={this.updateCostItemWithState} />
            </div>
        );
    }
}

const UploadWithSnackbar = withSnackbar(Upload);

interface UploadProps extends InjectedNotistackProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
}
class IntegratedUploadWithSnackbar extends React.Component<UploadProps, {}> {
    componentDidMount() {
        this.props.updatePageName(Page.UPLOAD.name);
    }
    render() {
        return (
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <UploadWithSnackbar />
            </SnackbarProvider>
        );
    }
}

export default IntegratedUploadWithSnackbar;