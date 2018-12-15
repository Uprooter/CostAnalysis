import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";

interface CostOverviewProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
}
export default class CostOverview extends React.Component<CostOverviewProps, {}> {

     componentDidMount() {
        this.props.updatePageName(Page.ROOT.name);
    }

    render() {

        return (
            <div>Hi here ist cost overview2</div>
        );
    }
}