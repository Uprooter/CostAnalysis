import * as React from "react";
import * as ReactDOM from "react-dom";
import { createClient } from "hal-rest-client";

import { DetailedCostCluster } from "./components/DetailedCostCluster";
import { DetailedCostClusterModel } from "./model/DetailedCostClusterModel";
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

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

    theme: Theme = createMuiTheme({
        palette: {
            primary: purple,
            secondary: {
                main: '#f44336',
            },
        },
        typography: {
            useNextVariants: true,
        },
    });

    render() {
        return (
            <MuiThemeProvider theme={this.theme}>
                <DetailedCostCluster detailedClusters={this.state.detailedClusters} />
            </MuiThemeProvider>);
    }
}

ReactDOM.render(<App />, document.getElementById('app'));