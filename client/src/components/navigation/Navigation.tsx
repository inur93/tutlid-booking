import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar as MuiToolbar, Typography, useMediaQuery } from "@mui/material";
import { Theme, useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Drawer } from "./Drawer";
import { NavigationMenu } from "./NavigationMenu";

const useStyles = makeStyles()((theme: Theme) =>
({
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
    const { classes, cx } = useStyles();
    const [showDrawer, setShowDrawer] = useState(false);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (<AppBar position="sticky" className={classes.root}>
        <MuiToolbar>
            <Typography variant="h6" className={classes.title}>
                Tutlið
            </Typography>
            {isSmall &&
                <IconButton
                    color='inherit'
                    aria-label='open drawer'
                    edge='end'
                    className={cx(showDrawer && classes.hide)}
                    onClick={() => setShowDrawer(true)}>
                    <MenuIcon />
                </IconButton>}
            <Drawer handleClose={() => setShowDrawer(false)} open={showDrawer} />
            {!isSmall && <NavigationMenu />}
        </MuiToolbar>
    </AppBar>)
}