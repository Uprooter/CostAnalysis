import { Action, ActionTypes } from "../actions/actions";
import { getOneYearBefore } from "../utils/dates";
export interface State {
    monthA: Date,
    monthB: Date,
}

export const initialState: State = {
    monthA: getOneYearBefore(new Date()),
    monthB: new Date(),
}

export function reducer(state: State = initialState, action: Action): State {

    switch (action.type) {
        case ActionTypes.UPDATE_COMPARE_DATES:
            return {
                ...state,
                monthA: action.payload.monthA,
                monthB: action.payload.monthB
            }

        default:
            return state
    }
}