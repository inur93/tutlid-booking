

import { Button, makeStyles, Menu, MenuItem, Theme } from '@material-ui/core';
import { LockOpen } from '@material-ui/icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import LanguageSelector from '../shared/LanguageSelect';
import { AdminMenuItem, CalendarMenuItem, GalleryMenuItem, HomeMenuItem } from './MenuItems';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    },
    icon: {
        color: 'white'
    }
}));

type Props = {}
export function NavigationMenu({ }: Props) {
    const classes = useStyles();
    const [user, { logout }] = useAuthUser();
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
        <HomeMenuItem />
        {user.isLoggedIn && <CalendarMenuItem />}
        <GalleryMenuItem />
        {isAdmin && <AdminMenuItem />}
        {user.isLoggedIn &&
            <Button aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                className={classes.icon}
                startIcon={<AccountCircle />}
                onClick={handleMenu}>
                {t('common:button.account')}
            </Button>}
        {!user.isLoggedIn && <Button data-cy='login-header-btn' className={classes.icon} component={Link} to='/login' startIcon={<LockOpen />}>
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
        <LanguageSelector />
    </div>);
}
