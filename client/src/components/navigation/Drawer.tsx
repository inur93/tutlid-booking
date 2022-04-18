
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Divider, Drawer as MUIDrawer, IconButton, List, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import LanguageSelector from '../shared/LanguageSelect';
import { AdminMenuItem, CalendarMenuItem, GalleryMenuItem, HomeMenuItem, LoginMenuItem, LogoutMenuItem } from './MenuItems';

const useStyles = makeStyles()((theme: Theme) =>
({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
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
    const { classes } = useStyles();
    const [user] = useAuthUser();

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
        {user.isLoggedIn && <LogoutMenuItem listItem onClick={handleClose} />}
        {!user.isLoggedIn && <LoginMenuItem listItem onClick={handleClose} />}

        <Divider />
        <LanguageSelector listItem onSelect={handleClose} />
    </MUIDrawer>
}