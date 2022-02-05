import { useTranslation } from 'react-i18next';
import RegisterUser from "../../components/register/Register";
import { SlimPage } from "../BasePage";

export function RegisterPage() {
    const { t } = useTranslation('app');
    return <SlimPage>
        <RegisterUser header={t('app:registerPage.header')} />
    </SlimPage>
}