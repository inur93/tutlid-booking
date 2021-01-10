import { Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { Role } from '../api';
import NewUserPanel from '../components/admin/NewUserPanel';
import PendingBookingsPanel from '../components/admin/PendingBookingsPanel';
import { useAuthUser } from '../hooks/useAuthUser';
import { useTranslation } from 'react-i18next';

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
    const {t} = useTranslation();
    if(!user.hasRole(Role.admin)) return <div>{t('shared.missingAccess')}</div>
    return (<Grid className={classes.root} container justify='center'>
        <Grid item xs={12} md={8} lg={6}>
            <NewUserPanel />
            <PendingBookingsPanel />
        </Grid>
    </Grid>);
}