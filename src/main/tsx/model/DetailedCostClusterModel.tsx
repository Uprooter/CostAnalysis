import { HalProperty, HalResource } from "hal-rest-client";
export class DetailedCostClusterModel extends HalResource {

    @HalProperty("name")
    public name: string;

    @HalProperty("cluster")
    public cluster: string;

}