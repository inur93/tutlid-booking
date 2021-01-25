import { Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type AccessDeniedProps = {
    requiredRoles?: Role[]
}
export default function AccessDenied({ requiredRoles }: AccessDeniedProps) {
    const classes = useStyles();
    const [user] = useAuthUser();
    const { t } = useTranslation('app');
    return (<Grid container justify='center'>
        <Grid className={classes.root} item xs={12} md={8} lg={6}>
            <Paper>
                <Typography variant="h2">{t('AccessDenied.header')}</Typography>
                {!user.isLoggedIn && <Typography variant="body1">
                    {t('app:accessDenied.requireLoginMsg')}
                </Typography>}
            </Paper>
        </Grid>
    </Grid>);
}