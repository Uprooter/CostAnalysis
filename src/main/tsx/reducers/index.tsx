import * as fromDetailedClusters from "./detailedCostCluster";
import * as navigation from "./navigation";
import { combineReducers } from "redux";

export interface State {
    detailedClusters: fromDetailedClusters.State,
    navigationOpen: navigation.State
}

export const initialState: State = {
    detailedClusters: fromDetailedClusters.initialState,
    navigationOpen: navigation.initialState
}

export const reducer = combineReducers<State>({
    detailedClusters: fromDetailedClusters.reducer,
    navigationOpen: navigation.reducer
})