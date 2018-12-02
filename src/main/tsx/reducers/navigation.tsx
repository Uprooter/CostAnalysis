import { Action, ActionTypes } from "../actions/actions";
export interface State {
    open: boolean;
}

export const initialState: State = {
    open: false
}

export function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.NAVIGATION_OPEN:
            return {open:action.payload}

        default:
            return state
    }
}