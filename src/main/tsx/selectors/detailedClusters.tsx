import { State } from '../reducers'
import { createSelector } from 'reselect'


const getDetailedClusterState = ((state: State) => state.detailedClusters)

export const getDetailedClusters = createSelector([getDetailedClusterState], s => s.detailedClusters)