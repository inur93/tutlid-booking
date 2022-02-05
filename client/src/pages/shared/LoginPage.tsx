import { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Login } from "../../components/login/Login";
import { useAuthUser } from "../../hooks/useAuthUser";
import { SlimPage } from "../BasePage";

export function LoginPage() {
    const [user] = useAuthUser();
    const router = useHistory();
    const { t } = useTranslation(['app']);

    useEffect(() => {
        if (user.isLoggedIn) {
            router.push('/');
        }
    }, [user]);
    return <SlimPage>
        <Login header={t('app:login.header')} />
    </SlimPage>
}