import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
import { Action, ActionTypes } from "../actions/actions";
export interface State {
    detailedClusters: DetailedCostClusterModel[]
}

export const initialState: State = {
    //detailedClusters: [{ name: "Test1", cluster: "Cluster1" }, { name: "Test2", cluster: "Cluster2" }]
    detailedClusters: []
}

export function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.ADD_DETAILED_CLUSTER:
            return {
                ...state,
                detailedClusters: [...state.detailedClusters, action.payload]
            }

        default:
            return state
    }
}