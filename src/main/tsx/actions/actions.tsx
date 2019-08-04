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
    UPDATE_ANALYSIS_DATES = "Update Analysis Dates",
}

export interface AddDetailedClusterAction { type: ActionTypes.ADD_DETAILED_CLUSTER, payload: DetailedCostClusterModel }
export interface AddCostItemsAction { type: ActionTypes.ADD_ITEMS, payload: CostItemModel[] }
export interface NavigationAction { type: ActionTypes.NAVIGATION_OPEN, openStatus: boolean }
export interface NavigatioPageUpdateAction { type: ActionTypes.UPDATE_PAGE_NAME, newName: string }
export interface UpdateAverageCostsAction { type: ActionTypes.UPDATE_AVERAGE_COSTS, payload: AverageCostResult }
export interface UpdateClusterCostsAction { type: ActionTypes.UPDATE_CLUSTER_COSTS, payload: ClusterCost[] }
export interface UpdateAnalysisDatesAction { type: ActionTypes.UPDATE_ANALYSIS_DATES, payload: { from: Date, to: Date } }


export function updateAverageCostResult(averageCosts: AverageCostResult): UpdateAverageCostsAction {
    return {
        type: ActionTypes.UPDATE_AVERAGE_COSTS,
        payload: averageCosts
    }
}

export function updateAnalysisDates(from: Date, to: Date): UpdateAnalysisDatesAction {
    return {
        type: ActionTypes.UPDATE_ANALYSIS_DATES,
        payload: { from: from, to: to }
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


export type Action = AddDetailedClusterAction | NavigationAction
    | NavigatioPageUpdateAction | AddCostItemsAction
    | UpdateAverageCostsAction | UpdateClusterCostsAction | UpdateAnalysisDatesAction;