import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Login } from "../../components/login/Login";
import { useContainer } from '../../ioc';
import { BasePage } from "../BasePage";

export const LoginPage = observer(() => {
    const { authStore } = useContainer();
    const router = useHistory();
    const { t } = useTranslation(['app']);

    useEffect(() => {
        if (authStore?.loggedIn) {
            router.push('/');
        }
    }, [authStore?.loggedIn]);
    return <BasePage>
        <Grid container justify='center'>
            <Grid item xs={12} sm={10} md={8} lg={6} >
                <Login header={t('app:login.header')} />
            </Grid>
        </Grid>
    </BasePage>
});