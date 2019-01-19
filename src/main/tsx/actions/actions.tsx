import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
import CostItemModel from "../models/CostItemModel";
import AverageCostResult from "../models/AverageCostResult";
import ClusterCost from "../models/ClusterCost";
export enum ActionTypes {
    ADD_DETAILED_CLUSTER = "Add",
    ADD_ITEMS = "Add Many",
    NAVIGATION_OPEN = "Open/Close",
    UPDATE_PAGE_NAME = "Update Page Name",
    UPDATE_AVERAGE_COSTS = "Update Average Costs",
    UPDATE_CLUSTER_COSTS = "Update Cluster Costs",
}

export interface AddDetailedClusterAction { type: ActionTypes.ADD_DETAILED_CLUSTER, payload: DetailedCostClusterModel }
export interface AddCostItemsAction { type: ActionTypes.ADD_ITEMS, payload: CostItemModel[] }
export interface NavigationAction { type: ActionTypes.NAVIGATION_OPEN, openStatus: boolean }
export interface NavigatioPageUpdateAction { type: ActionTypes.UPDATE_PAGE_NAME, newName: string }
export interface UpdateAverageCostsAction { type: ActionTypes.UPDATE_AVERAGE_COSTS, payload: AverageCostResult }
export interface UpdateClusterCostsAction { type: ActionTypes.UPDATE_CLUSTER_COSTS, payload: ClusterCost[] }


export function updateAverageCostResult(averageCosts: AverageCostResult): UpdateAverageCostsAction {
    return {
        type: ActionTypes.UPDATE_AVERAGE_COSTS,
        payload: averageCosts
    }
}

export function updateClusterCosts(clusterCosts: ClusterCost[]): UpdateClusterCostsAction {
    return {
        type: ActionTypes.UPDATE_CLUSTER_COSTS,
        payload: clusterCosts
    }
}

export function addDetailedCluster(newDetailedCluster: DetailedCostClusterModel): AddDetailedClusterAction {
    return {
        type: ActionTypes.ADD_DETAILED_CLUSTER,
        payload: newDetailedCluster
    }
}

export function addCostItems(items: CostItemModel[]): AddCostItemsAction {
    return {
        type: ActionTypes.ADD_ITEMS,
        payload: items
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


export type Action = AddDetailedClusterAction | NavigationAction | NavigatioPageUpdateAction | AddCostItemsAction | UpdateAverageCostsAction | UpdateClusterCostsAction;