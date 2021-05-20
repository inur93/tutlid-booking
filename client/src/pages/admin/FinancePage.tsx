import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Role } from '../../api';
import BankInformation from '../../components/admin/finance/BankInformation';
import PriceMatrix from '../../components/admin/finance/PriceMatrix';
import Panel from '../../components/shared/Panel';
import ProtectedComponent from '../../components/shared/ProtectedComponent';
import { BasePage } from '../BasePage';

export function FinancePage() {
    const { t } = useTranslation('app');
    return (<ProtectedComponent requiredRoles={[Role.admin]}>
        <BasePage>
            <Panel>
                <Typography variant='h6'>{t('app:bankInformation.header')}</Typography>
                <BankInformation />

                <Typography variant="h6">{t('app:priceMatrix.header')}</Typography>
                <PriceMatrix />
            </Panel>
        </BasePage>
    </ProtectedComponent>)
}