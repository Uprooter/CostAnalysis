import * as React from "react";
import { NavigatioPageUpdateAction, UpdateAverageCostsAction, UpdateClusterCostsAction } from "../../actions/actions";
import Page from "../../utils/pages";
import { getRequest } from "../../utils/rest";
import MonthlySummaryTable from "./MonthlySummaryTable";
import ClusterHistoryChart from "./ClusterHistoryChart";
import CostOverviewControl from "./CostOverviewControl";
import ClusterCostTable from "./ClusterCostTable";
import AverageCostResult from "../../models/AverageCostResult";
import { Grid, } from '@material-ui/core';
import ClusterCost from "../../models/ClusterCost";
import YearlyCost from "../../models/YearlyCost";

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    updateAverageCostResult: (averageCosts: AverageCostResult) => UpdateAverageCostsAction;
    updateClusterCosts: (clusterCosts: ClusterCost[]) => UpdateClusterCostsAction;
    averageCosts: AverageCostResult;
    clusterCosts: ClusterCost[];
}
interface CostOverviewState {
    yearlyClusterCosts: YearlyCost[];
    selectedClusterForHistory: string
}
export default class CostOverview extends React.Component<CostOverviewProps, CostOverviewState> {

    state = {
        yearlyClusterCosts: new Array<YearlyCost>(),
        selectedClusterForHistory: ""
    }

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
    }

    loadClusterHistory = (cluster: string) => {
        this.setState({ selectedClusterForHistory: cluster });
        getRequest("/costsByCluster?cluster=" + cluster)
            .then(r => {
                this.setState({ yearlyClusterCosts: r.entity });
            });
    }

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
                    <ClusterHistoryChart
                        yearlyClusterCosts={this.state.yearlyClusterCosts}
                        selectedClusterForHistory={this.state.selectedClusterForHistory} />
                </Grid>
            </Grid>
        );
    }
}
