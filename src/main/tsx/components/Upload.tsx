import * as React from "react";
import { NavigatioPageUpdateAction } from "../actions/actions";
import Page from "../utils/pages";
import Button from '@material-ui/core/Button';
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';

interface UploadProps {
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
}
export default class Upload extends React.Component<UploadProps, {}> {

    componentDidMount() {
        this.props.updatePageName(Page.UPLOAD.name)
    }

    readInFile(file: File) {
        let client = rest.wrap(mime);
        client({
            path: "/api/upload",
            entity: { "file": file },
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            method: "POST"
        }).then(r => {
            console.log(r.entity);
        });
    }

    render() {
        return (
            <div>
                <input
                    accept=".csv"
                    id="contained-button-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => { this.readInFile(e.target.files[0]) }}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label>
            </div>
        );
    }
}