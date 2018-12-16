import CostItemModel from "../models/CostItemModel";
import { Action, ActionTypes } from "../actions/actions";
export interface State {
    costItems: CostItemModel[]
}

export const initialState: State = {
    //detailedClusters: [{ name: "Test1", cluster: "Cluster1" }, { name: "Test2", cluster: "Cluster2" }]
    costItems: []
}

export function reducer(state: State = initialState, action: Action):State {
    switch (action.type) {
        case ActionTypes.ADD_ITEMS:
            return {
                ...state,
                costItems: [...state.costItems, ...action.payload]
            }

        default:
            return state
    }
}