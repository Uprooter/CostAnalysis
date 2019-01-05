import DetailedCluster from "./DetailedCostClusterModel"
import RecipientModel from "./RecipientModel"

export default class CostItemModel {
    id: number;

    amount: number;

    recipient: RecipientModel;

    owner: string;

    type: string = "";

    detailedCluster: DetailedCluster = { "name": "", "cluster": "" };

    purpose: string;

    creationDate: string;
}