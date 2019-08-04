import { HalProperty, HalResource } from "hal-rest-client";

export default class RecipientModel extends HalResource {

    @HalProperty()
    name: string;
}