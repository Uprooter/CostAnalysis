import { State } from '../reducers'
import { createSelector } from 'reselect'


const getAverageCostState = ((state: State) => state.averageCosts)
const getClusterCostsState = ((state: State) => state.clusterCosts)
const getCompareState = ((state: State) => state.compare)
const getDetailedClusterState = ((state: State) => state.detailedClusters)

export const getAverageCost = createSelector([getAverageCostState], s => s.averageCosts)

export const getAnalysisFromDate = createSelector([getAverageCostState], s => s.fromDate)
export const getAnalysisToDate = createSelector([getAverageCostState], s => s.toDate)

export const getCompareMonthA = createSelector([getCompareState], s => s.monthA)
export const getCompareMonthB = createSelector([getCompareState], s => s.monthB)

export const getClusterCosts = createSelector([getClusterCostsState], s => s.clusterCosts)

export const getDetailedClusters = createSelector([getDetailedClusterState], s => s.detailedClusters)
