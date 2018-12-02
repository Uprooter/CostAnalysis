import * as fromDetailedClusters from "./detailedCostCluster";
import { combineReducers } from "redux";

export interface State {
    detailedClusters: fromDetailedClusters.State
}

export const initialState: State = {
    detailedClusters: fromDetailedClusters.initialState
}

export const reducer = combineReducers<State>({
    detailedClusters: fromDetailedClusters.reducer
})