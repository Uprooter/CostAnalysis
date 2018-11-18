import * as React from "react";
import * as ReactDOM from "react-dom";
import { createClient } from "hal-rest-client";

import { DetailedCostCluster } from "./components/DetailedCostCluster";
import { DetailedCostClusterModel } from "./model/DetailedCostClusterModel";

export interface AppState {
    detailedClusters: DetailedCostClusterModel[];
}
export class App extends React.Component<{}, AppState> {

    readonly state: AppState = {
        detailedClusters: []
    }

    componentDidMount() {

        createClient().fetchArray("/api/detailedCostClusters", DetailedCostClusterModel)
            .then(r => { this.setState({ detailedClusters: r }) });
    }

    render() {
        return (<DetailedCostCluster detailedClusters={this.state.detailedClusters} />);
    }
}

ReactDOM.render(<App />, document.getElementById('app'));