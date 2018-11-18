import { HalProperty, HalResource } from "hal-rest-client";
export class DetailedCostClusterModel extends HalResource {

    @HalProperty()
    public name: string;

    @HalProperty()
    public cluster: string;

}