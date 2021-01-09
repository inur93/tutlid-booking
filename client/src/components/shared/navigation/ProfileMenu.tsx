

import React, { useState } from 'react';
import { Button, createStyles, IconButton, ListSubheader, makeStyles, Menu, MenuItem, Theme } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/HomeRounded';
import AdminIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { LoginModal } from '../../login/LoginModal';
import { Role } from '../../../api';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    },
    icon: {
        color: 'white'
    }
}));

type ProfileMenuProps = {}
export default function ProfileMenu({ }: ProfileMenuProps) {
    const classes = useStyles();
    const [user, { logout }] = useAuthUser();
    const [showLogin, setShowLogin] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        setAnchorEl(null);
    }

    const isAdmin = user.hasRole(Role.admin);
    return (<div>
        <IconButton component={Link} to={'/'}>
            <HomeIcon className={classes.icon} />
        </IconButton>
        {isAdmin &&
            <IconButton component={Link} to={'/admin'}>
                <AdminIcon className={classes.icon}/>
            </IconButton>}
        {user.isLoggedIn &&
            <IconButton aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}>
                <AccountCircle />
            </IconButton>}
        {!user.isLoggedIn && <Button color="inherit" onClick={() => setShowLogin(true)}>Login</Button>}
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
        >
            <MenuItem divider disabled >{user.fullName}</MenuItem>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>);
}