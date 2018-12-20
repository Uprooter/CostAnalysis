import CostItemModel from "../models/CostItemModel";
import { Action, ActionTypes } from "../actions/actions";
export interface State {
    costItems: CostItemModel[]
}

export const initialState: State = {    
    costItems: []
}

export function reducer(state: State = initialState, action: Action):State {
    switch (action.type) {
        case ActionTypes.ADD_ITEMS:
            return {
                ...state,
                costItems: [...action.payload]
            }

        default:
            return state
    }
}