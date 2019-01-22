import { State } from '../reducers'
import { createSelector } from 'reselect'


const getAverageCostState = ((state: State) => state.averageCosts)
const getClusterCostsState = ((state: State) => state.clusterCosts)

export const getAverageCost = createSelector([getAverageCostState], s => s.averageCosts)

export const getAnalysisFromDate= createSelector([getAverageCostState], s => s.fromDate)
export const getAnalysisToDate= createSelector([getAverageCostState], s => s.toDate)

export const getClusterCosts = createSelector([getClusterCostsState], s => s.clusterCosts)
