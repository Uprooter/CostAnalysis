import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Main from "./containers/Main";
import Notfound from "./components/Notfound";
import CostItems from "./components/CostItems";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import logger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { reducer, initialState } from "./reducers";

//the logger logs old and new state
const store = createStore(reducer, initialState, applyMiddleware(logger));

export class App extends React.Component<{}, {}> {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/items" component={CostItems} />
                    <Route component={Notfound} />
                </Switch>
            </Router>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));