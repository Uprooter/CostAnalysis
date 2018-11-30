import * as React from "react";
import * as rest from 'rest';
import * as mime from 'rest/interceptor/mime';
import DetailedCostClusters from "../containers/DetailedCostClusters";
import { AddDetailedClusterAction } from "../actions/actions";
import DetailedCostClusterModel from "../models/DetailedCostClusterModel";
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



export interface MainProps {
    onAddDetailedCluster: (newDetailedCluster: DetailedCostClusterModel) => AddDetailedClusterAction;
}
export default class Main extends React.Component<MainProps, {}> {

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
                {/* <AppBar position="static">
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
                </Drawer> */}
                <DetailedCostClusters />
            </MuiThemeProvider>
        );
    }
}