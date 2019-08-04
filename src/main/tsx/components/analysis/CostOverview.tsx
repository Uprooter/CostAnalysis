import * as React from "react";
import { NavigatioPageUpdateAction, UpdateAverageCostsAction, UpdateClusterCostsAction } from "../../actions/actions";
import Page from "../../utils/pages";
import { getRequest } from "../../utils/rest";
import MonthlySummaryTable from "./MonthlySummaryTable";
import ClusterHistoryChart from "./ClusterHistoryChart";
import CostOverviewControl from "./containers/CostOverviewControl";
import ClusterCostTable from "./containers/ClusterCostTable";
import AverageCostResult from "../../models/AverageCostResult";
import { Grid, } from '@material-ui/core';
import ClusterCost from "../../models/ClusterCost";
import TireFrameCostEntry from "../../models/TimeFrameCostEntry";
import { getDateString } from "../../utils/dates";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    updateAverageCostResult: (averageCosts: AverageCostResult) => UpdateAverageCostsAction;
    updateClusterCosts: (clusterCosts: ClusterCost[]) => UpdateClusterCostsAction;
    averageCosts: AverageCostResult;
    clusterCosts: ClusterCost[];
}
interface CostOverviewState {
    yearlyClusterCosts: TireFrameCostEntry[];
    monthlyClusterCosts: TireFrameCostEntry[];
    clusterCosts: TireFrameCostEntry[];
    selectedClusterForHistory: string;
    diagramPrecision: string;
}
export default class CostOverview extends React.Component<CostOverviewProps, CostOverviewState> {

    state = {
        yearlyClusterCosts: new Array<TireFrameCostEntry>(),
        monthlyClusterCosts: new Array<TireFrameCostEntry>(),
        clusterCosts: new Array<TireFrameCostEntry>(),
        selectedClusterForHistory: "",
        diagramPrecision: "years"
    }

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
    }

    loadClusterHistory = (cluster: string) => {
        this.setState({ selectedClusterForHistory: cluster });

        if (this.state.diagramPrecision === "years") {
            getRequest("/costsByClusterYearly?cluster=" + cluster)
                .then(r => {
                    this.setState({ clusterCosts: r.entity });
                });
        }
        else {
            getRequest("/costsByClusterMonthly?cluster=" + cluster + "&from=" + getDateString(new Date()))
                .then(r => {
                    console.log(r.entity);
                    this.setState({ clusterCosts: r.entity });
                });
        }
    }

    handlePrecisionChange = (newValue: string) => {
        this.setState({ diagramPrecision: newValue }, () => { this.loadClusterHistory(this.state.selectedClusterForHistory) });
    };


    render() {
        return (
            <Grid container spacing={16}>
                <Grid item sm>
                    <CostOverviewControl updateAverageCostResult={this.props.updateAverageCostResult} updateClusterCosts={this.props.updateClusterCosts} />
                </Grid>

                <Grid item xs={12}>
                    <MonthlySummaryTable averageCosts={this.props.averageCosts} />
                </Grid>

                <Grid item sm>
                    <ClusterCostTable clusterCosts={this.props.clusterCosts} loadClusterHistory={this.loadClusterHistory} />
                </Grid>
                <Grid item sm>
                    <RadioGroup
                        aria-label="Genauigkeit"
                        name="precision"
                        value={this.state.diagramPrecision}
                        onChange={(event, value) => this.handlePrecisionChange(value)}
                    >
                        <FormControlLabel value="months" control={<Radio color="primary" />} label="Letzte 12 Monate" />
                        <FormControlLabel value="years" control={<Radio color="primary" />} label="Alle Jahre" />
                    </RadioGroup>
                    <ClusterHistoryChart
                        clusterCosts={this.state.clusterCosts}
                        selectedClusterForHistory={this.state.selectedClusterForHistory} />
                </Grid>
            </Grid>
        );
    }
}
