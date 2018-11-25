import * as React from "react";
import * as ReactDOM from "react-dom";
import Main from "./components/Main";
import Notfound from "./components/Notfound";
import CostItems from "./components/CostItems";

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

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

ReactDOM.render(<App />, document.getElementById('app'));