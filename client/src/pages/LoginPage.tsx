import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { Login } from "../components/login/Login";
import { useAuthUser } from "../hooks/useAuthUser";
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { BasePage } from "./BasePage";
import { useTranslation } from "react-i18next";

export function LoginPage() {
    const [user] = useAuthUser();
    const router = useHistory();
    const { t } = useTranslation(['app']);

    useEffect(() => {
        if (user.isLoggedIn) {
            router.push('/');
        }
    }, [user]);
    return <BasePage>
        <Login header={t('app:login.header')} />
    </BasePage>
}