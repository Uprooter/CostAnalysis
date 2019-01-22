import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import DetailedClusterAdmin from "./containers/DetailedClusterAdmin";
import Notfound from "./components/Notfound";
import Upload from "./containers/Upload";
import CostOverview from "./components/analysis/containers/CostOverview";
import { Route, Switch } from "react-router";
import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./reducers";
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import NavigationBar from "./containers/NavigationBar";
import Page from "./utils/pages";
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

export class App extends React.Component<{}, {}> {

    history = createBrowserHistory();
    composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    store = createStore(
        reducer(this.history),
        this.composeEnhancer(applyMiddleware(routerMiddleware(this.history))));

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
            <Provider store={this.store}>
                <MuiThemeProvider theme={this.theme}>
                    <NavigationBar />
                    <ConnectedRouter history={this.history}>
                        <Switch>
                            <Route exact path={Page.ROOT.pathName} component={CostOverview} />
                            <Route path={Page.UPLOAD.pathName} component={Upload} />
                            <Route path={Page.ADMIN_DETAILED_CLUSTERS.pathName} component={DetailedClusterAdmin} />
                            <Route path="/error" component={Notfound} />
                            <Route component={Notfound} />
                        </Switch>
                    </ConnectedRouter>
                </MuiThemeProvider>
            </Provider>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('app'));