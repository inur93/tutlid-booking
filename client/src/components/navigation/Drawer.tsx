
import { createStyles, Divider, Drawer as MUIDrawer, IconButton, List, makeStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import LanguageSelector from '../shared/LanguageSelect';
import { AdminMenuItem, CalendarMenuItem, GalleryMenuItem, HomeMenuItem, LoginMenuItem, LogoutMenuItem } from './MenuItems';
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
    const [user, actions] = useAuthUser();
    const logout = async () => {
        await actions.logout();
        handleClose();
    }
    const isAdmin = user.hasRole(Role.admin);
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
            {user.isLoggedIn && <CalendarMenuItem listItem onClick={handleClose} />}
            <GalleryMenuItem listItem onClick={handleClose} />
            {isAdmin && <AdminMenuItem listItem onClick={handleClose} />}
        </List>
        <Divider />
        {user.isLoggedIn && <LogoutMenuItem listItem onClick={logout} />}
        {!user.isLoggedIn && <LoginMenuItem listItem onClick={handleClose} />}

        <Divider />
        <LanguageSelector listItem onSelect={handleClose} />
    </MUIDrawer>
}