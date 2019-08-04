import ClusterCost from "../models/ClusterCost";
import { Action, ActionTypes } from "../actions/actions";
export interface State {
    clusterCosts: ClusterCost[]
}

export const initialState: State = {
    clusterCosts: new Array<ClusterCost>()
}

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case ActionTypes.UPDATE_CLUSTER_COSTS:
            return {
                ...state,
                clusterCosts: action.payload
            }

        default:
            return state
    }
}