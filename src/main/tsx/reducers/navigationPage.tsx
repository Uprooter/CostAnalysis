import { Action, ActionTypes } from "../actions/actions";
export interface State {
    pageName: string;
}

export const initialState: State = {
    pageName: "Kostenübersicht",
}

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case ActionTypes.UPDATE_PAGE_NAME:
            return { pageName: action.newName }
        default:
            return state
    }
}