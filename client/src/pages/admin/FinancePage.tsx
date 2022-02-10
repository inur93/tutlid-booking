import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Role } from '../../api';
import BankInformation from '../../components/admin/finance/BankInformation';
import PriceMatrix from '../../components/admin/finance/PriceMatrix';
import Panel from '../../components/shared/Panel';
import ProtectedComponent from '../../components/shared/ProtectedComponent';
import { Spacer } from '../../components/shared/Spacer';
import { SlimPage } from '../shared/BasePage';

export function FinancePage() {
    const { t } = useTranslation('app');
    return (<SlimPage>
        <ProtectedComponent requiredRoles={[Role.admin]}>
            <Panel>
                <Typography variant='h2'>{t('app:bankInformation.header')}</Typography>
                <Spacer />
                <BankInformation />
                <Spacer />
                <Typography variant="h2">{t('app:priceMatrix.header')}</Typography>
                <PriceMatrix />
            </Panel>
        </ProtectedComponent>
    </SlimPage >)
}