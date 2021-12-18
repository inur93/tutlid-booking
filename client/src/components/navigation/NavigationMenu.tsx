

import { Button, makeStyles, Menu, MenuItem, Theme } from '@material-ui/core';
import { LockOpen } from '@material-ui/icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useContainer } from '../../ioc';
import LanguageSelector from '../shared/LanguageSelect';
import { AdminMenuItem, GalleryMenuItem, HomeMenuItem } from './MenuItems';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    },
    icon: {
        color: 'white'
    }
}));

type Props = {}
const NavigationMenu = observer(({ }: Props) => {
    const classes = useStyles();
    const { authStore } = useContainer();
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
        authStore?.logout();
        setAnchorEl(null);
    }

    return (<div>
        <HomeMenuItem />
        <GalleryMenuItem />
        {authStore?.isAdmin && <AdminMenuItem />}
        {authStore?.loggedIn &&
            <Button aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                className={classes.icon}
                startIcon={<AccountCircle />}
                onClick={handleMenu}>
                {t('common:button.account')}
            </Button>}
        {!authStore?.loggedIn && <Button className={classes.icon} component={Link} to='/login' startIcon={<LockOpen />}>
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
            <MenuItem divider disabled >{authStore?.fullName}</MenuItem>
            <MenuItem onClick={handleLogout}>{t('common:button.logout')}</MenuItem>
        </Menu>
        <LanguageSelector />
    </div>);
})

export {
    NavigationMenu
};

