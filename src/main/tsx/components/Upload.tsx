import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";

interface UploadProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
}
export default class Upload extends React.Component<UploadProps, {}> {

    componentDidMount() {
        this.props.updatePageName(Page.UPLOAD.name)
    }

    render() {
        return (<div>Here is upload</div>);
    }
}