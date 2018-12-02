import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
export enum ActionTypes {
    ADD_DETAILED_CLUSTER = "[detailedCluster] Add"
}

export interface AddDetailedClusterAction { type: ActionTypes.ADD_DETAILED_CLUSTER, payload: DetailedCostClusterModel }

export function addDetailedCluster(newDetailedCluster: DetailedCostClusterModel): AddDetailedClusterAction {
    return {
        type: ActionTypes.ADD_DETAILED_CLUSTER,
        payload: newDetailedCluster
    }
}

export type Action = AddDetailedClusterAction;