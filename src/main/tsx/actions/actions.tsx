import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
export enum ActionTypes {
    ADD_DETAILED_CLUSTER = "[DetailedCluster] Add",
    NAVIGATION_OPEN = "[Naviation] Open/Close",

    UPDATE_PAGE_NAME = "[Naviation] Update Page Name",
}

export interface AddDetailedClusterAction { type: ActionTypes.ADD_DETAILED_CLUSTER, payload: DetailedCostClusterModel }

export interface NavigationAction { type: ActionTypes.NAVIGATION_OPEN, openStatus: boolean }
export interface NavigatioPageUpdateAction { type: ActionTypes.UPDATE_PAGE_NAME, newName: string }

export function addDetailedCluster(newDetailedCluster: DetailedCostClusterModel): AddDetailedClusterAction {
    return {
        type: ActionTypes.ADD_DETAILED_CLUSTER,
        payload: newDetailedCluster
    }
}

export function triggerNavigationBar(open: boolean): NavigationAction {
    return {
        type: ActionTypes.NAVIGATION_OPEN,
        openStatus: open
    }
}

export function updatePageName(newName: string): NavigatioPageUpdateAction {
    return {
        type: ActionTypes.UPDATE_PAGE_NAME,
        newName: newName
    }
}

export type Action = AddDetailedClusterAction | NavigationAction | NavigatioPageUpdateAction;