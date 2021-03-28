import { Button, ListItem, ListItemIcon, ListItemText, makeStyles, Theme } from "@material-ui/core";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HomeIcon from '@material-ui/icons/HomeRounded';
import ImageIcon from '@material-ui/icons/Image';
import AdminIcon from '@material-ui/icons/Settings';
import LoginIcon from '@material-ui/icons/LockOpen';
import LogoutIcon from '@material-ui/icons/MeetingRoom';

const useStyles = makeStyles((theme: Theme) =>
({
    icon: {
        color: 'white'
    }
}));

type Props = {
    onClick?: () => void,
    listItem?: boolean,
    textKey: string,
    link: string,
    icon: ReactNode
}
function MenuItem({ onClick, listItem, textKey, link, icon }: Props) {
    const { t } = useTranslation('common');
    const classes = useStyles();
    const text = t(textKey)
    if (listItem) {
        return (
            <ListItem button component={Link} to={link} onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        )
    }
    return (
        <Button className={classes.icon}
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
    return <MenuItem {...props} icon={<HomeIcon />} link='/' textKey='common:button.home' />
}

export function GalleryMenuItem(props: MenuItemProps) {
    return <MenuItem {...props} icon={<ImageIcon />} link='/gallery' textKey='common:button.gallery' />
}

export function AdminMenuItem(props: MenuItemProps) {
    return <MenuItem {...props} icon={<AdminIcon />} link='/admin' textKey='common:button.settings' />
}

export function LoginMenuItem(props: MenuItemProps) {
    return <MenuItem {...props} icon={<LoginIcon />} link='/login' textKey='common:button.login' />
}

export function LogoutMenuItem(props: MenuItemProps) {
    return <MenuItem {...props} icon={<LogoutIcon />} link='/login' textKey='common:button.logout' />
}