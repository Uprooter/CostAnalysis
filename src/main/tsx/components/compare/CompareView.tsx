import { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { getMonths, getYearMonth, getYears, getOneMonthAfter } from "../../utils/dates";
import CompareTable from "./CompareTable";
import CompareModel from "../../models/CompareModel";
import YearMonth from "../../models/YearMonth";
import { getRequest } from "../../utils/rest"
import * as React from "react";

export default function CompareView() {

    const [monthA, setMonthA] = useState<YearMonth>(getYearMonth(new Date()));
    const [monthB, setMonthB] = useState<YearMonth>(getYearMonth(getOneMonthAfter(new Date())));
   

    const gridItemStyle = { marginLeft: 10, marginTop: 20 };
    return (
        <Grid container spacing={16}>
            <Grid item sm>
                <FormControl>
                    <InputLabel>Von: </InputLabel>
                    <Select
                        value={monthA.month}
                        onChange={e => { setMonthA(new YearMonth(parseInt(e.target.value), monthA.year)); loadClusterCompare(); }}>
                        {
                            getMonths().map(month => {
                                return (<MenuItem value={month.number}>{month.name}</MenuItem>);
                            })
                        }
                    </Select>
                    <Select
                        value={monthA.year}
                        onChange={e => { setMonthA(new YearMonth(monthA.month, parseInt(e.target.value))); loadClusterCompare() }}>
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
                        value={monthB.month}
                        onChange={e => { setMonthB(new YearMonth(parseInt(e.target.value), monthB.year)); loadClusterCompare() }}>
                        {
                            getMonths().map(month => {
                                return (<MenuItem value={month.number}>{month.name}</MenuItem>);
                            })
                        }
                    </Select>
                    <Select
                        value={monthB.year}
                        onChange={e => { setMonthB(new YearMonth(monthB.month, parseInt(e.target.value))); loadClusterCompare() }}>
                        {
                            getYears().map(year => {
                                return (<MenuItem value={year}>{year}</MenuItem>);
                            })
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm>
                <CompareTable monthA={monthA} monthB={monthB} clusterCompareItems={clusterCompareItems} />
            </Grid>
        </Grid>
    )

}
