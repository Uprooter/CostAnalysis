import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import BuildIcon from '@material-ui/icons/Build';
import { NavigationAction } from "../actions/actions";

interface NavigationProps {
    navigationOpen: boolean;
    onTriggerNavigationBar: (open: boolean) => NavigationAction;
}
export default class NavigationBar extends React.Component<NavigationProps, {}> {

    render() {

        return (
            <div>
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={() => { this.props.onTriggerNavigationBar(true) }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            Kostenübersicht
                        </Typography>
                        <SearchIcon />
                        <InputBase placeholder="Search…" />
                    </Toolbar>
                </AppBar>
                <Drawer open={this.props.navigationOpen} onClose={() => { this.props.onTriggerNavigationBar(false) }}>
                    <List>
                        <ListItem button key={"overview"}>
                            <ListItemIcon><ListIcon /></ListItemIcon>
                            <ListItemText primary={"Übersicht"} />
                        </ListItem>
                        <ListItem button key={"overview"}>
                            <ListItemIcon><InboxIcon /></ListItemIcon>
                            <ListItemText primary={"Hochladen"} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key={"adminDetailedClusters"}>
                            <ListItemIcon><BuildIcon /></ListItemIcon>
                            <ListItemText primary={"Pflege Detail Typen"} />
                        </ListItem>

                    </List>
                </Drawer>
            </div>
        );
    }
}