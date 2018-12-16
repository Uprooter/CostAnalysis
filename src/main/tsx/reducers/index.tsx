import * as fromDetailedClusters from "./detailedCostCluster";
import * as costItems from "./costItems";
import * as navigationBar from "./navigationBar";
import * as navigationPage from "./navigationPage";
import { combineReducers } from "redux";
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';

export interface State {
    detailedClusters: fromDetailedClusters.State,
    costItems: costItems.State,
    navigationBar: navigationBar.State,
    navigationPage: navigationPage.State,
    router: RouterState;

}

const reducer = (history: History) => combineReducers<State>({
    router: connectRouter(history),
    detailedClusters: fromDetailedClusters.reducer,
    costItems: costItems.reducer,
    navigationBar: navigationBar.reducer,
    navigationPage: navigationPage.reducer
})

export default reducer