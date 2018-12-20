import DetailedCostClusterModel from "./DetailedCostClusterModel";
import RecipientModel from "./RecipientModel";
import { HalProperty, HalResource } from "hal-rest-client";

export default class CostItemModel extends HalResource {

    @HalProperty()
    amount: number;

    @HalProperty("detailedCluster", DetailedCostClusterModel)
    detailedCluster: DetailedCostClusterModel;

    @HalProperty("recipient", RecipientModel)
    recipient: RecipientModel;

    @HalProperty()
    owner: string;

    @HalProperty()
    type: string;

    @HalProperty()
    purpose: string;

    @HalProperty()
    creationDate: Date;
}