import * as React from "react";
import { FormControlLabel, Button, Switch, FormGroup, Grid, TextField } from '@material-ui/core';
import { getDateString, getDashDateString, getOneYearBefore } from "../../utils/dates";

interface CompareViewProps {
    monthA: Date;
    monthB: Date;
}
interface CompareViewState {
}
export default class CompareView extends React.Component<CompareViewProps, CompareViewState> {

    handleDateChange(newDate: Date, dateField: string) {
        if (dateField === "monthA") {
           //do stuff
        }
        else {
           //do stuff
        }
    }

    render() {
        const gridItemStyle = { marginLeft: 10, marginTop: 20 };
        return (

            <Grid container spacing={16}>
                <TextField id="monthA" label="Monat A" type="date" style={{ margin: 5 }} value={getDashDateString(this.props.monthA)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "monthA") }}
                    />
                    <TextField id="monthB" label="Monat B" type="date" style={{ margin: 5 }} value={getDashDateString(this.props.monthB)}
                        InputLabelProps={{
                            shrink: true,
                        }} onChange={e => { this.handleDateChange(new Date(e.target.value), "monthB") }}
                    />
            </Grid>
        )
    }
}