import { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { getMonths, getYearMonth, getYears, getMonthsBefore, getMonthFromName } from "../../utils/dates";
import YearMonth from "../../models/YearMonth";
import CompareTable from "./CompareTable"
import * as React from "react";

export default function CompareView() {

    const [monthA, setMonthA] = useState<YearMonth>(getYearMonth(getMonthsBefore(new Date(), 2)));
    const [monthB, setMonthB] = useState<YearMonth>(getYearMonth(getMonthsBefore(new Date(), 1)));


    const gridItemStyle = { marginLeft: 10, marginTop: 20 };
    return (
        <Grid container direction="column">
            <Grid container direction="row" justify="flex-start">
                <Grid item sm>
                    <FormControl>
                        <InputLabel>Von: </InputLabel>
                        <Select
                            value={monthA.month.name}
                            onChange={e => setMonthA(new YearMonth(getMonthFromName(e.target.value), monthA.year))}>
                            {
                                getMonths().map(month => {
                                    return (<MenuItem key={month.displayNumber} value={month.name}>{month.name}</MenuItem>);
                                })
                            }
                        </Select>
                        <Select
                            value={monthA.year}
                            onChange={e => setMonthA(new YearMonth(monthA.month.displayNumber, parseInt(e.target.value)))} >
                            {
                                getYears().map(year => {
                                    return (<MenuItem key={year} value={year}>{year}</MenuItem>);
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm>
                    <FormControl>
                        <InputLabel>Bis: </InputLabel>
                        <Select
                            value={monthB.month.name}
                            onChange={e => setMonthB(new YearMonth(getMonthFromName(e.target.value), monthB.year))}>
                            {
                                getMonths().map(month => {
                                    return (<MenuItem key={month.displayNumber} value={month.name}>{month.name}</MenuItem>);
                                })
                            }
                        </Select>
                        <Select
                            value={monthB.year}
                            onChange={e => setMonthB(new YearMonth(monthB.month.displayNumber, parseInt(e.target.value)))}>
                            {
                                getYears().map(year => {
                                    return (<MenuItem key={year} value={year}>{year}</MenuItem>);
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item sm>
                <CompareTable monthA={monthA} monthB={monthB} />
            </Grid>
        </Grid>
    )

}
