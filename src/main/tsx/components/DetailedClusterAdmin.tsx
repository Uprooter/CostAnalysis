import * as React from "react";
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import DetailedCostClusters from "../containers/DetailedCostClusters";
import { AddDetailedClusterAction } from "../actions/actions";
import DetailedCostClusterModel from "../models/DetailedCostClusterModel";


export interface DetailedClusterAdminProps {
    onAddDetailedCluster: (newDetailedCluster: DetailedCostClusterModel) => AddDetailedClusterAction;
}
export default class DetailedClusterAdmin extends React.Component<DetailedClusterAdminProps, {}> {

    componentDidMount() {

        this.getEmbeddedArray("/api/detailedCostClusters");
    }

    getEmbeddedArray(path: string) {
        let client = rest.wrap(mime);

        client({ path: path }).then(r => {
            for (let entry of r.entity._embedded.detailedCostClusters) {
                this.props.onAddDetailedCluster(entry);
            }
        });
    }


    render() {
        return (
            <DetailedCostClusters />
        );
    }
}