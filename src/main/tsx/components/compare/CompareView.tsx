import * as React from "react";
import {FormControl, Grid, InputLabel, MenuItem, Select} from '@material-ui/core';
import {getMonths, getYearMonth, getYears} from "../../utils/dates";
import CompareTable from "./CompareTable";
import CompareModel from "../../models/CompareModel";
import YearMonth from "../../models/YearMonth";
import {UpdateCompareDatesAction} from "../../actions/actions";
import {getRequest} from "../../utils/rest"

interface CompareViewProps {
    updateCompareDates: (monthA: YearMonth, monthB: YearMonth) => UpdateCompareDatesAction;
    monthA: YearMonth;
    monthB: YearMonth;
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
            this.props.updateCompareDates(getYearMonth(newDate), this.props.monthB);
        } else {
            this.props.updateCompareDates(this.props.monthA, getYearMonth(newDate));
        }
        this.loadClusterCompare();
    }

    loadClusterCompare = () => {
        getRequest("/compareClusterCosts?"
            + "monthA=" + this.props.monthA.getRestString()
            + "&monthB=" + this.props.monthB.getRestString())
            .then(r => {
                this.setState({clusterCompareItems: r.entity});
            });
    }

    handleMonthAChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        //setAge(event.target.value);
    };

    render() {
        const gridItemStyle = {marginLeft: 10, marginTop: 20};
        return (

            <Grid container spacing={16}>
                <Grid item sm>
                    <FormControl>
                        <InputLabel>Von: </InputLabel>
                        <Select
                            value={this.props.monthA.month}
                            onChange={this.handleMonthAChange}>
                            {
                                getMonths().map(month => {
                                    return (<MenuItem value={month.number}>{month.name}</MenuItem>);
                                })
                            }
                        </Select>
                        <Select
                            value={this.props.monthA.month}
                            onChange={this.handleMonthAChange}>
                            {
                                getYears().map(year => {
                                    return (<MenuItem value={year}>{year}</MenuItem>);
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm>
                    <FormControl>
                        <InputLabel>Bis: </InputLabel>
                        <Select
                            value={this.props.monthB.month}
                            onChange={this.handleMonthAChange}>
                            {
                                getMonths().map(month => {
                                    return (<MenuItem value={month.number}>{month.name}</MenuItem>);
                                })
                            }
                        </Select>
                        <Select
                            value={this.props.monthB.month}
                            onChange={this.handleMonthAChange}>
                            {
                                getYears().map(year => {
                                    return (<MenuItem value={year}>{year}</MenuItem>);
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm>
                    <CompareTable monthA={this.props.monthA} monthB={this.props.monthB}
                                  clusterCompareItems={this.state.clusterCompareItems}/>
                </Grid>
            </Grid>
        )
    }
}
