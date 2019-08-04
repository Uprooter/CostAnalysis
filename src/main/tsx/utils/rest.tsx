import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';

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

export function getRequest(path: string): rest.ResponsePromise {
    let client = rest.wrap(mime);
    return client({ path: path });
}
