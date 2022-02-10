import { Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Role } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import { LoginModal } from '../login/LoginModal';

type Props = {
    requiredRoles?: Role[],
    children: JSX.Element
}
export default function ProtectedComponent({ requiredRoles, children }: Props) {
    const [user] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);
    const [showLogin, setShowLogin] = useState(false);

    const loginComplete = () => {
        window.location.reload();
    }
    if (!(requiredRoles && requiredRoles.find(x => !user.hasRole(x)))) {
        return children;
    }

    return (<Grid container justifyContent='center'>
        <Grid item>
            <Typography variant="h1">{t('AccessDenied.header')}</Typography>
            {user.isLoggedIn && <Typography data-cy="protected-component-label" variant="body1">
                {t('app:accessDenied.requireRoles', { roles: requiredRoles.map(x => `"${x}"`).join(', ') })}
            </Typography>}
            {!user.isLoggedIn && <Typography data-cy="protected-component-label" variant="body1">
                {t('app:accessDenied.requireLoginMsg')}
            </Typography>}
            {!user.isLoggedIn && <Button data-cy='login-btn' color='primary' variant='contained' onClick={() => setShowLogin(true)}>
                {t('common:button.login')}
            </Button>}
            {showLogin && <LoginModal onClose={loginComplete} />}
        </Grid>
    </Grid>);
}