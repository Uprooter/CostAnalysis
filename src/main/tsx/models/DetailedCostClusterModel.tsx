
export default class DetailedCostClusterModel {

    name: string;
    cluster: string;
    _links: {
        self: {
            href: string
        }
    }
    constructor(name: string, cluster: string) {
        this.name = name;
        this.cluster = cluster;
    }
}