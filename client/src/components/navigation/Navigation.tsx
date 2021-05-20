import { AppBar, IconButton, Toolbar as MuiToolbar, Typography, useMediaQuery } from "@material-ui/core";
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from "classnames";
import React, { useState } from 'react';
import { Drawer } from "./Drawer";
import { NavigationMenu } from "./NavigationMenu";

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
        hide: {
            display: 'none'
        }
    }),
);

export function Navigation() {
    const classes = useStyles();
    const [showDrawer, setShowDrawer] = useState(false);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (<AppBar position="static" className={classes.root}>
        <MuiToolbar>
            <Typography variant="h6" className={classes.title}>
                Tutlið
            </Typography>
            {isSmall &&
                <IconButton
                    color='inherit'
                    aria-label='open drawer'
                    edge='end'
                    className={classNames(showDrawer && classes.hide)}
                    onClick={() => setShowDrawer(true)}>
                    <MenuIcon />
                </IconButton>}
            <Drawer handleClose={() => setShowDrawer(false)} open={showDrawer} />
            {!isSmall && <NavigationMenu />}
        </MuiToolbar>
    </AppBar>)
}