import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
export enum ActionTypes {
    ADD_DETAILED_CLUSTER = "[DetailedCluster] Add",
    NAVIGATION_OPEN = "[Naviation] Open/Close",
}

export interface AddDetailedClusterAction { type: ActionTypes.ADD_DETAILED_CLUSTER, payload: DetailedCostClusterModel }

export interface NavigationAction { type: ActionTypes.NAVIGATION_OPEN, payload: boolean }

export function addDetailedCluster(newDetailedCluster: DetailedCostClusterModel): AddDetailedClusterAction {
    return {
        type: ActionTypes.ADD_DETAILED_CLUSTER,
        payload: newDetailedCluster
    }
}

export function triggerNavigationBar(open: boolean): NavigationAction {
    return {
        type: ActionTypes.NAVIGATION_OPEN,
        payload: open
    }
}

export type Action = AddDetailedClusterAction | NavigationAction;