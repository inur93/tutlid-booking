import React from 'react';
import { createStyles, makeStyles, Theme, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { useAuthUser } from '../hooks/useAuthUser';
import { Role } from '../api';
import NewUserPanel from '../components/admin/NewUserPanel';
import PendingBookingsPanel from '../components/admin/PendingBookingsPanel';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
        marginTop: theme.spacing(2)
    }
}));

type AdminPageProps = {}
export default function AdminPage({ }: AdminPageProps) {
    const classes = useStyles();
    const [user] = useAuthUser();
    if(!user.hasRole(Role.admin)) return <div>You do not have access to this page</div>
    return (<Grid className={classes.root} container justify='center'>
        <Grid item xs={12} md={8} lg={6}>
            <NewUserPanel />
            <PendingBookingsPanel />
        </Grid>
    </Grid>);
}