import * as React from "react";
import { Grid, TextField } from '@material-ui/core';
import { getDashDateString, getDateString, getDEDateString } from "../../utils/dates";
import CompareTable from "./CompareTable";
import CompareModel from "../../models/CompareModel";
import { UpdateCompareDatesAction } from "../../actions/actions";
import { getRequest } from "../../utils/rest"

interface CompareViewProps {
    updateCompareDates: (monthA: Date, monthB: Date) => UpdateCompareDatesAction;
    monthA: Date;
    monthB: Date;
}
interface CompareViewState {
    clusterCompareItems: CompareModel[];
}
export default class CompareView extends React.Component<CompareViewProps, CompareViewState> {
    state = {
        clusterCompareItems: new Array<CompareModel>(),
    }

    handleDateChange(newDate: Date, dateField: string) {
        console.log(newDate);
        if (dateField === "monthA") {
            this.props.updateCompareDates(newDate, this.props.monthB);
        }
        else {
            this.props.updateCompareDates(this.props.monthA, newDate);
        }
        this.loadClusterCompare();
    }

    loadClusterCompare = () => {     
        getRequest("/compareClusterCosts?monthA=" + getDateString(this.props.monthA)
            + "&monthB=" + getDateString(this.props.monthB))
            .then(r => {
                this.setState({ clusterCompareItems: r.entity });
            });
    }

    render() {
        const gridItemStyle = { marginLeft: 10, marginTop: 20 };
        return (

            <Grid container spacing={16}>
                <Grid item sm>
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
                <Grid item sm>
                    <CompareTable monthA={this.props.monthA} monthB={this.props.monthB} clusterCompareItems={this.state.clusterCompareItems} />
                </Grid>
            </Grid>
        )
    }
}