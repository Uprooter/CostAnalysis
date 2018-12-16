import * as React from "react";
import { NavigatioPageUpdateAction, AddCostItemsAction } from "../actions/actions";
import Page from "../utils/pages";
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import CostItemModel from "../models/CostItemModel";

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    onAddItems: (newItems: CostItemModel[]) => AddCostItemsAction;
}
export default class CostOverview extends React.Component<CostOverviewProps, {}> {

    componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);

        let client = rest.wrap(mime);

        client({ path: "/api/costItems" }).then(r => {
            for (let entry of r.entity._embedded.costItems) {
                this.props.onAddDetailedCluster(entry);
            }
        });
    }

    render() {

        return (
            <div>Hi here ist cost overview2</div>
        );
    }
}