import { State } from '../reducers'
import { createSelector } from 'reselect'


const getCostItemsState = ((state: State) => state.costItems)

export const getCostItems= createSelector([getCostItemsState], s => s.costItems)