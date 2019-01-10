import DetailedClusterModel from "./DetailedCostClusterModel"
import RecipientModel from "./RecipientModel"

export default class CostItemModel {
    id: number;

    clientId: number;

    amount: number;

    recipient: RecipientModel;

    owner: string;

    type: string = "";

    detailedCluster: DetailedClusterModel = new DetailedClusterModel("", "");

    purpose: string;

    creationDate: Date;

    validState: boolean = true;
}
