import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import CostItemModel from "../models/CostItemModel";
import { createClient, HalResource } from "hal-rest-client";

export function getEmbeddedArray(path: string): [] {
    let client = rest.wrap(mime);
    let embeddedArray: [];
    client({ path: path }).then(r => {
        console.log(r.entity._embedded);
        embeddedArray = r.entity._embedded;
    });

     console.log(embeddedArray);
    return embeddedArray;
}

export async function fetchCostItems(): Promise<CostItemModel[]> {
    let client = createClient("/api");
    let costItems: CostItemModel[];
    client.fetchArray("/costItems", CostItemModel).then(r => {
        costItems = r;

        for (let i in r) {
            fetchRecipientName(r[i].link("recipient")).then(r => { costItems[i].recipient.name = r });
        }

    });

    return costItems;
}


async function fetchRecipientName(link: HalResource): Promise<string> {
    await link.fetch()
    return link.prop("name");
}