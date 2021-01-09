import { AppBar, Button, Toolbar as MuiToolbar, Typography } from "@material-ui/core";
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LoginModal } from "../login/LoginModal";
import { useAuthUser } from "../../hooks/useAuthUser";
import { Role } from "../../api";
import ProfileMenu from "./navigation/ProfileMenu";
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
            <ProfileMenu />
        </MuiToolbar>
    </AppBar>)
}