import * as fromDetailedClusters from "./detailedCostCluster";
import * as costItems from "./costItems";
import * as averageCosts from "./averageCosts";
import * as navigationBar from "./navigationBar";
import * as navigationPage from "./navigationPage";
import { combineReducers } from "redux";
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';

export interface State {
    detailedClusters: fromDetailedClusters.State,
    navigationBar: navigationBar.State,
    navigationPage: navigationPage.State,
    router: RouterState,
    averageCosts: averageCosts.State,

}

const reducer = (history: History) => combineReducers<State>({
    router: connectRouter(history),
    detailedClusters: fromDetailedClusters.reducer,
    navigationBar: navigationBar.reducer,
    navigationPage: navigationPage.reducer,
    averageCosts: averageCosts.reducer
})

export default reducer