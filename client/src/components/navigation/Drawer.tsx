
import { createStyles, Divider, Drawer as MUIDrawer, IconButton, List, makeStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Role } from '../../api';
import { useContainer } from '../../ioc';
import LanguageSelector from '../shared/LanguageSelect';
import { AdminMenuItem, GalleryMenuItem, HomeMenuItem, LoginMenuItem, LogoutMenuItem } from './MenuItems';
const useStyles = makeStyles((theme) =>
    createStyles({
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
        },
        drawerPaper: {
            width: 300,
        },
    }));

type Props = {
    open: boolean,
    handleClose: () => void
}
export function Drawer({ open, handleClose }: Props) {
    const classes = useStyles();
    const { authStore } = useContainer();
    const logout = async () => {
        await authStore?.logout();
        handleClose();
    }
    
    return <MUIDrawer
        anchor='right'
        onClose={handleClose}
        classes={
            { paper: classes.drawerPaper }
        }
        open={open}>
        <div className={classes.drawerHeader}>
            <IconButton onClick={handleClose}>
                <ChevronRightIcon />
            </IconButton>
        </div>
        <Divider />
        <List>
            <HomeMenuItem listItem onClick={handleClose} />
            <GalleryMenuItem listItem onClick={handleClose} />
            {authStore?.isAdmin && <AdminMenuItem listItem onClick={handleClose} />}
        </List>
        <Divider />
        {authStore?.loggedIn && <LogoutMenuItem listItem onClick={logout} />}
        {!authStore?.loggedIn && <LoginMenuItem listItem onClick={handleClose} />}

        <Divider />
        <LanguageSelector listItem onSelect={handleClose} />
    </MUIDrawer>
}