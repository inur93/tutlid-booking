

import { LockOpen } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button, Menu, MenuItem, Theme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import LanguageSelector from '../shared/LanguageSelect';
import { AdminMenuItem, CalendarMenuItem, GalleryMenuItem, HomeMenuItem } from './MenuItems';

const useStyles = makeStyles()((theme: Theme) =>
({
    icon: {
        color: 'white'
    }
}));

type Props = {}
export function NavigationMenu({ }: Props) {
    const { classes } = useStyles();
    const [user] = useAuthUser();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation('common');

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            <MenuItem component={Link} to='/logout' onClick={handleClose}>{t('common:button.logout')}</MenuItem>
        </Menu>
        <LanguageSelector />
    </div>);
}
