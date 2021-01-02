import * as React from "react";
import { useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import DetailedCostClusterModel from "../../models/DetailedCostClusterModel";
import { Select, Button, Grid, TextField } from '@material-ui/core';
import CostItemModel from "../../models/CostItemModel";
import { detailedName } from '../../utils/detailedClusters';
import { getDashDateString, parseISOString } from "../../utils/dates";

interface CostEditDialogProps {
    selections: {
        types: string[],
        detailedClusters: DetailedCostClusterModel[],
        clusters: string[],
    };
    dialogOpen: boolean;
    costItem: CostItemModel;
    changeDialogVisibility: (dialogOpen: boolean) => void;
    updateValue: (newValue: string, field: string, typeValue?: string) => void;
    updateCostItem: (changedItem: CostItemModel) => void;
}

interface Errors {
    typeError: boolean,
    detailedClusterCombinedError: boolean,
    clusterError: boolean
}

const CostEditDialog: React.FC<CostEditDialogProps> = ({ selections, dialogOpen, costItem, changeDialogVisibility, updateValue, updateCostItem }) => {

    const [errors, setErrors] = useState<Errors>({
        typeError: false,
        detailedClusterCombinedError: false,
        clusterError: false
    });
    const [newDetailedCluster, setNewDetailedCluster] = useState<DetailedCostClusterModel>(new DetailedCostClusterModel("", ""));

    const handleSumbit = (event: React.FormEvent) => {
        if (hasErrors()) {
            event.preventDefault();
        }
        else {
            if (detailedName(costItem.detailedCluster) !== "") {
                updateCostItem(Object.assign({}, costItem, { duplicate: false, similar: false }));
            }
            else {
                updateCostItem(Object.assign({}, costItem, { detailedCluster: newDetailedCluster, duplicate: false, similar: false }));
            }
            changeDialogVisibility(false);
        }
    }

    const hasErrors = (): boolean => {
        let typeIsMissing = costItem.type === "";
        let combinedMissing = detailedName(costItem.detailedCluster) === "";
        let newClusterMissing = newDetailedCluster.cluster === "";
        let detailedClusterMissing = newClusterMissing && combinedMissing;

        setErrors({
            typeError: typeIsMissing,
            detailedClusterCombinedError: detailedClusterMissing,
            clusterError: detailedClusterMissing
        }
        );

        return typeIsMissing || detailedClusterMissing;
    }

    return (
        <Dialog
            PaperProps={{
                style: {
                    minWidth: "40vw"
                }
            }}
            disableBackdropClick
            disableEscapeKeyDown
            open={dialogOpen}
            onClose={() => { console.log("Close") }}>
            <DialogTitle>Details anpassen...</DialogTitle>
            <DialogContent>
                <form onSubmit={e => handleSumbit(e)}>
                    <Grid container spacing={16}>
                        <Grid item>
                            <FormControl>
                                <Button onClick={() => updateValue("VERPFLEGUNG / Lebensmittel", "detailedClusterAndType", "FLEXIBEL")}>
                                    Lebensmittel</Button>
                                <Button onClick={() => updateValue("ALLGEMEIN / -", "detailedClusterAndType", "FLEXIBEL")}>Allgemein</Button>
                                <Button onClick={() => updateValue("VERKEHRSMITTEL / Benzin", "detailedClusterAndType", "FLEXIBEL")}>Benzin</Button>
                                <Button onClick={() => updateValue("FREIZEIT / -", "detailedClusterAndType", "FLEXIBEL")}>Freizeit</Button>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <Button onClick={() => updateValue("KIND / -", "detailedClusterAndType", "FLEXIBEL")}>Kind</Button>
                                <Button onClick={() => updateValue("HW_MOEBEL / -", "detailedClusterAndType", "FLEXIBEL")}>HW Moebel</Button>
                                <Button onClick={() => updateValue("BEKLEIDUNG / -", "detailedClusterAndType", "FLEXIBEL")}>Bekleidung</Button>
                                <Button onClick={() => updateValue("GESUNDHEIT / -", "detailedClusterAndType", "FLEXIBEL")}>Gesundheit</Button>
                                <Button onClick={() => updateValue("GEHALT / -", "detailedClusterAndType", "GEHALT")}>Gehalt</Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item>
                            <FormControl>
                                <InputLabel htmlFor="type-select">Kostenart</InputLabel>
                                <Select
                                    style={{ width: "200px" }}
                                    error={errors.typeError}
                                    value={costItem.type}
                                    onChange={e => { updateValue(e.target.value, "type") }}
                                    input={<Input id="type-select" />}>
                                    {
                                        selections.types.map(c => {
                                            return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item>
                            <FormControl>
                                <InputLabel htmlFor="cluster-select">Typ/Detail</InputLabel>
                                <Select
                                    style={{ width: "300px" }}
                                    error={errors.detailedClusterCombinedError}
                                    value={detailedName(costItem.detailedCluster)}
                                    onChange={e => { updateValue(e.target.value, "detailedCluster") }}
                                    input={<Input id="detailed-cluster-select" />}>
                                    {
                                        selections.detailedClusters.map(c => {
                                            return (<MenuItem key={c._links.self.href} value={detailedName(c)}>{detailedName(c)}</MenuItem>);
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item>
                            <FormControl>
                                <InputLabel htmlFor="cluster-select">Typ</InputLabel>
                                <Select
                                    style={{ width: "200px" }}
                                    error={errors.clusterError}
                                    value={newDetailedCluster.cluster}
                                    onChange={e => {
                                        setNewDetailedCluster(new DetailedCostClusterModel(newDetailedCluster.name, e.target.value));
                                    }}
                                    input={<Input id="cluster-select" />}>
                                    {
                                        selections.clusters.map(c => {
                                            return (<MenuItem value={c} key={c}>{c}</MenuItem>);
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <TextField label="Detail" onChange={e => {
                                    setNewDetailedCluster(new DetailedCostClusterModel(e.target.value, newDetailedCluster.cluster));
                                }}>{newDetailedCluster.name}</TextField>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <TextField id="dialogDate" label="Datum" type="date" style={{ margin: 5 }}
                                    value={costItem.creationDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }} onChange={e => {
                                        updateValue(e.target.value, "creationDate")
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => handleSumbit(e)} color="primary">Ok</Button>
                <Button onClick={() => changeDialogVisibility(false)} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog >
    );
}
export default CostEditDialog;