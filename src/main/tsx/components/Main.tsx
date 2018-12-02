import * as React from "react";
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import DetailedCostClusters from "../containers/DetailedCostClusters";
import NavigationBar from "../containers/NavigationBar";
import { AddDetailedClusterAction } from "../actions/actions";
import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';



export interface MainProps {
    onAddDetailedCluster: (newDetailedCluster: DetailedCostClusterModel) => AddDetailedClusterAction;
}
export default class Main extends React.Component<MainProps, {}> {

    componentDidMount() {

        this.getEmbeddedArray("/api/detailedCostClusters");
    }

    getEmbeddedArray(path: string) {
        let client = rest.wrap(mime);

        client({ path: path }).then(r => {
            for (let entry of r.entity._embedded.detailedCostClusters) {
                this.props.onAddDetailedCluster(entry);
            }
        });
    }

    theme: Theme = createMuiTheme({
        palette: {
            primary: { main: '#2196f3', },
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
                <NavigationBar />
                <DetailedCostClusters />
            </MuiThemeProvider>
        );
    }
}