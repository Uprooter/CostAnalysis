import { State } from '../reducers'
import { createSelector } from 'reselect'


const getAverageCostState = ((state: State) => state.averageCosts)

export const getAverageCost = createSelector([getAverageCostState], s => s.averageCosts)