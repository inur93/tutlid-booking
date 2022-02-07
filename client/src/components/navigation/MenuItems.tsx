import { Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader, makeStyles, Menu, MenuItem as MuiMenuItem, Theme } from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import classNames from "classnames";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FinanceIcon, BookingsIcon, HomeIcon, ImageIcon, LoginIcon, LogoutIcon, UsersIcon, AdminIcon } from "../shared/Icons";

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

export function CalendarMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<CalendarToday />} link='/calendar' text={t('common:button.calendar')} />
}

export function GalleryMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<ImageIcon />} link='/gallery' text={t('common:button.gallery')} />
}

export function AdminMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<AdminIcon />} link='/admin' text={t('common:button.admin')} />
}

export function LoginMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<LoginIcon />} link='/login' text={t('common:button.login')} />
}

export function LogoutMenuItem(props: MenuItemProps) {
    const { t } = useTranslation('common');
    return <MenuItem {...props} icon={<LogoutIcon />} link='/login' text={t('common:button.logout')} />
}
