import { AppBar, Toolbar as MuiToolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Role } from "../../api";
import { useAuthUser } from "../../hooks/useAuthUser";
import Toolbar from "./navigation/Toolbar";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export function Navigation() {
    const classes = useStyles();
    const [user, { logout }] = useAuthUser();
    const isLoggedIn = user.isLoggedIn;
    const isAdmin = user.hasRole(Role.admin);

    return (<AppBar position="static" className={classes.root}>
        <MuiToolbar>
            <Typography variant="h6" className={classes.title}>
                Tutlið
            </Typography>
            <Toolbar />
        </MuiToolbar>
    </AppBar>)
}