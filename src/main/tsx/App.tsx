import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import DetailedClusterAdmin from "./components/DetailedClusterAdmin";
import Notfound from "./components/Notfound";
import Upload from "./components/Upload";
import CostOverview from "./components/CostOverview";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import logger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { reducer, initialState } from "./reducers";
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import NavigationBar from "./containers/NavigationBar";

//the logger logs old and new state
const store = createStore(reducer, initialState, applyMiddleware(logger));

export class App extends React.Component<{}, {}> {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={CostOverview} />
                    <Route path="/upload" component={Upload} />
                    <Route path="/detailedclusters" component={DetailedClusterAdmin} />
                    <Route path="/error" component={Notfound} />
                    <Route component={Notfound} />
                </Switch>
            </Router>
        );
    }


}

export const theme: Theme = createMuiTheme({
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

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <NavigationBar />
            <App />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('app'));