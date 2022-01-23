import { Button, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import { LoginModal } from '../login/LoginModal';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
        marginTop: theme.spacing(2)
    }
}));

type Props = {
    requiredRoles?: Role[],
    children: JSX.Element
}
export default function ProtectedComponent({ requiredRoles, children }: Props) {
    const classes = useStyles();
    const [user] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);
    const [showLogin, setShowLogin] = useState(false);

    const loginComplete = () => {
        window.location.reload();
    }
    if (!(requiredRoles && requiredRoles.find(x => !user.hasRole(x)))) {
        return children;
    }

    return (<Grid container justify='center'>
        <Grid className={classes.root} item xs={12} md={8} lg={6}>
            <Typography variant="h4">{t('AccessDenied.header')}</Typography>
            {user.isLoggedIn && <Typography data-cy="protected-component-label" variant="body1">
                {t('app:accessDenied.requireRoles', { roles: requiredRoles.map(x => `"${x}"`).join(', ') })}
            </Typography>}
            {!user.isLoggedIn && <Typography data-cy="protected-component-label" variant="body1">
                {t('app:accessDenied.requireLoginMsg')}
            </Typography>}
            {!user.isLoggedIn && <Button data-cy='login-btn' color='primary' variant='contained' onClick={() => setShowLogin(true)}>
                {t('common:button.login')}
            </Button>}
        </Grid>
        {showLogin && <LoginModal onClose={loginComplete} />}
    </Grid>);
}