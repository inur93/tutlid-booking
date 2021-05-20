import { Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, Menu, MenuItem as MuiMenuItem, Theme } from "@material-ui/core";
import FinanceIcon from '@material-ui/icons/AccountBalance';
import BookingsIcon from '@material-ui/icons/Event';
import HomeIcon from '@material-ui/icons/HomeRounded';
import ImageIcon from '@material-ui/icons/Image';
import LoginIcon from '@material-ui/icons/LockOpen';
import LogoutIcon from '@material-ui/icons/MeetingRoom';
import UsersIcon from '@material-ui/icons/People';
import AdminIcon from '@material-ui/icons/Settings';
import classNames from "classnames";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
({
    icon: {
        color: 'white'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

type Props = {
    onClick?: () => void,
    listItem?: boolean,
    nested?: boolean,
    text: string,
    link: string,
    icon: ReactNode
}

function MenuItem({ onClick, listItem, text, link, icon, nested }: Props) {
    const classes = useStyles();
    if (listItem) {

        return (
            <ListItem className={classNames(nested && classes.nested)} button component={Link} to={link} onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        )


    }
    return (<Button className={classes.icon}
        onClick={onClick}
        component={Link}
        to={link}
        startIcon={icon}>
        {text}
    </Button>)
}

export type MenuItemProps = {
    listItem?: boolean,
    onClick?: () => void
}
export function HomeMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<HomeIcon />} link='/' text={t('common:button.home')} />
}

export function GalleryMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<ImageIcon />} link='/gallery' text={t('common:button.gallery')} />
}

export function AdminMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);

    const options = [
        {
            link: '/admin/users',
            icon: <UsersIcon />,
            text: t('common:button.users')
        },
        {
            link: '/admin/bookings',
            icon: <BookingsIcon />,
            text: t('common:button.bookings')
        },
        {
            link: '/admin/finances',
            icon: <FinanceIcon />,
            text: t('common:button.bank')
        }
    ]
    if (props.listItem) {
        return <div>
            <ListSubheader>
                {t('common:button.admin')}
            </ListSubheader>
            <List disablePadding component='div'>
                {options.map(x => <MenuItem
                    key={x.link}
                    nested
                    listItem={props.listItem}
                    onClick={props.onClick}
                    icon={x.icon}
                    link={x.link}
                    text={x.text} />)}
            </List>
        </div>
    }
    return <div style={{ display: 'inline-block' }}>
        <Button
            startIcon={<AdminIcon />}
            color='inherit'
            aria-controls='admin-settings-menu'
            aria-haspopup="true"
            onClick={handleClick}>
            {t('common:button.admin')}
        </Button>
        <Menu
            id="admin-settings-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {options.map(x => <MuiMenuItem
                key={x.link}
                component={Link}
                to={x.link}
                onClick={handleClose}>
                <ListItemIcon>
                    {x.icon}
                </ListItemIcon>
                {x.text}
            </MuiMenuItem>)}
        </Menu>
    </div>
}

export function LoginMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<LoginIcon />} link='/login' text={t('common:button.login')} />
}

export function LogoutMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<LogoutIcon />} link='/login' text={t('common:button.logout')} />
}
