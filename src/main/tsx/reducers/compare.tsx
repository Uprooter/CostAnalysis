import {Action, ActionTypes} from "../actions/actions";
import {getOneMonthBefore} from "../utils/dates";
import YearMonth from "../models/YearMonth";

export interface State {
    monthA: YearMonth,
    monthB: YearMonth
}

export const initialState: State = {
    monthA: new YearMonth(getOneMonthBefore(new Date()).getMonth(), new Date().getFullYear()),
    monthB: new YearMonth(new Date().getMonth(), new Date().getFullYear())
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
