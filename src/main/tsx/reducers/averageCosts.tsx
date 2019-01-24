import AverageCostResult from "../models/AverageCostResult";
import { Action, ActionTypes } from "../actions/actions";
import { getOneYearBefore } from "../utils/dates";
export interface State {
    averageCosts: AverageCostResult,
    fromDate: Date,
    toDate: Date,
}

export const initialState: State = {
    averageCosts: new AverageCostResult(),
    fromDate: getOneYearBefore(new Date()),
    toDate: new Date(),
}

export function reducer(state: State = initialState, action: Action): State {

    switch (action.type) {
        case ActionTypes.UPDATE_AVERAGE_COSTS:
            return {
                ...state,
                averageCosts: action.payload
            }
        case ActionTypes.UPDATE_ANALYSIS_DATES:
            return {
                ...state,
                fromDate: action.payload.from,
                toDate: action.payload.to
            }

        default:
            return state
    }
}
