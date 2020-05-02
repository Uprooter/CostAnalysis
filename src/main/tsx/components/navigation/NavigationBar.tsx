import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import CompareIcon from '@material-ui/icons/Compare';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssessmentIcon from '@material-ui/icons/Assessment';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import BuildIcon from '@material-ui/icons/Build';
import { NavigationAction, NavigatioPageUpdateAction } from "../../actions/actions";
import Page from "../../utils/pages";

interface NavigationProps {
    navigationOpen: boolean;
    pageName: string;
    onTriggerNavigationBar: (open: boolean) => NavigationAction;
    updatePageName: (newName: string) => NavigatioPageUpdateAction;
    push: (path: string) => any;
}
export default class NavigationBar extends React.Component<NavigationProps, {}> {

    goTo(page: Page) {
        this.props.updatePageName(page.name);
        this.props.push(page.pathName);
        this.props.onTriggerNavigationBar(false);
    }

    render() {
        return (
            <div>
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={() => { this.props.onTriggerNavigationBar(true) }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>{this.props.pageName}</Typography>
                        <SearchIcon />
                        <InputBase placeholder="Search…" />
                    </Toolbar>
                </AppBar>
                <Drawer open={this.props.navigationOpen} onClose={() => { this.props.onTriggerNavigationBar(false) }}>
                    <List>
                        <ListItem button key={"overview"} onClick={() => { this.goTo(Page.ROOT) }}>
                            <ListItemIcon><AssessmentIcon /></ListItemIcon>
                            <ListItemText primary={Page.ROOT.name} />
                        </ListItem>
                        <ListItem button key={"upload"} onClick={() => { this.goTo(Page.UPLOAD) }}>
                            <ListItemIcon><InboxIcon /></ListItemIcon>
                            <ListItemText primary={Page.UPLOAD.name} />
                        </ListItem>
                        <ListItem button key={"compare"} onClick={() => { this.goTo(Page.COMPARE) }}>
                            <ListItemIcon><CompareIcon /></ListItemIcon>
                            <ListItemText primary={Page.COMPARE.name} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key={"adminDetailedClusters"} onClick={() => { this.goTo(Page.ADMIN_DETAILED_CLUSTERS) }}>
                            <ListItemIcon><BuildIcon /></ListItemIcon>
                            <ListItemText primary={Page.ADMIN_DETAILED_CLUSTERS.name} />
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        );
    }
}