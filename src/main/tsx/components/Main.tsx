import * as React from "react";
import { createClient } from "hal-rest-client";
import DetailedCostCluster from "./DetailedCostCluster";
import DetailedCostClusterModel from "../model/DetailedCostClusterModel";
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export interface MainState {
    detailedClusters: DetailedCostClusterModel[];
    navigationOpen: boolean;
}
export default class Main extends React.Component<{}, MainState> {

    readonly state: MainState = {
        detailedClusters: [],
        navigationOpen: false
    }

    componentDidMount() {

        createClient().fetchArray("/api/detailedCostClusters", DetailedCostClusterModel)
            .then(r => { this.setState({ detailedClusters: r }) });
    }

    theme: Theme = createMuiTheme({
        palette: {
            primary: { main: '#2196f3', },
            secondary: {
                main: '#f44336',
            },
        },
        typography: {
            useNextVariants: true,
        },
    });

    render() {
        const navigationItems: string[] = ['Kostenübersicht'];
        const navigationItemsAdmin: string[] = ['Pflege Detail-Typen'];


        return (
            <MuiThemeProvider theme={this.theme}>               
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu" onClick={() => { this.setState({ navigationOpen: true }) }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            Kostenübersicht
                        </Typography>
                        <SearchIcon />
                        <InputBase placeholder="Search…" />
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.navigationOpen} onClose={() => { this.setState({ navigationOpen: false }) }}>
                    <List>
                        {navigationItems.map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {navigationItemsAdmin.map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <DetailedCostCluster detailedClusters={this.state.detailedClusters} />
            </MuiThemeProvider>
        );
    }
}