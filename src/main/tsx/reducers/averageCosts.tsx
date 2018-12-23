import AverageCostResult from "../models/AverageCostResult";
import { Action, ActionTypes } from "../actions/actions";
export interface State {
    averageCosts: AverageCostResult
}

export const initialState: State = {
    averageCosts: new AverageCostResult()
}

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case ActionTypes.UPDATE_AVERAGE_COSTS:
            return {                
                averageCosts: action.payload
            }

        default:
            return state
    }
}