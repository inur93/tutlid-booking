import { useTranslation } from 'react-i18next';
import RegisterUser from "../../components/register/Register";
import { BasePage } from "../BasePage";

export function RegisterPage() {
    const {t} = useTranslation('app');
    return <BasePage>
            <RegisterUser header={t('app:registerPage.header')}/>
        </BasePage>
}