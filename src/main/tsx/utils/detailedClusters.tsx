import DetailedCostClusterModel from "../models/DetailedCostClusterModel";

export function detailedName(detailedCluster: DetailedCostClusterModel): string {
    if (detailedCluster !== undefined) {
        if (detailedCluster.cluster === "" && detailedCluster.name === "")
        {
            return "";
        }
            return detailedCluster.cluster + " / " + detailedCluster.name;
    }

    return "";
}

export function getFromDetailedName(detailedName: string): DetailedCostClusterModel {
   
    if (detailedName !== undefined) {
        return new DetailedCostClusterModel(detailedName.split("/", 2)[1].trim(), detailedName.split("/", 1)[0].trim());
    }

    return new DetailedCostClusterModel("", "");
}