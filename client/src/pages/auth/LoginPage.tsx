import { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Login } from '../../components/login/Login';
import { useAuthUser } from '../../hooks/useAuthUser';
import { SlimPage } from '../shared/BasePage';

export function LoginPage() {
    const [user] = useAuthUser();
    const navigate = useNavigate();
    const { t } = useTranslation(['app']);

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }
    }, [user]);
    return <SlimPage>
        <Login header={t('app:login.header')} />
    </SlimPage>
}