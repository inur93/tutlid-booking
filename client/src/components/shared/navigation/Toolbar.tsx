

import { Button, IconButton, makeStyles, Menu, MenuItem, Theme } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/HomeRounded';
import AdminIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Role } from '../../../api';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { LoginModal } from '../../login/LoginModal';
import LanguageSelector from '../LanguageSelect';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    },
    icon: {
        color: 'white'
    }
}));

type ToolbarProps = {}
export default function Toolbar({ }: ToolbarProps) {
    const classes = useStyles();
    const [user, { logout }] = useAuthUser();
    const [showLogin, setShowLogin] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation('common');

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
                <AdminIcon className={classes.icon} />
            </IconButton>}
        {user.isLoggedIn &&
            <IconButton aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}>
                <AccountCircle />
            </IconButton>}
        {!user.isLoggedIn && <Button color="inherit" onClick={() => setShowLogin(true)}>
            {t('common:button.login')}
        </Button>}
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
            <MenuItem onClick={handleLogout}>{t('common:button.logout')}</MenuItem>
        </Menu>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        <LanguageSelector />
    </div>);
}