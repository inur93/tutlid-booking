import { Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookingCalendar } from '../components/calendar/BookingCalendar';
import Panel from '../components/shared/Panel';
import { useAuthUser } from '../hooks/useAuthUser';
import { BasePage } from './BasePage';

export function Home() {
    const [user] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);

    return <BasePage fullWidth={user.isLoggedIn} >
        {user.isLoggedIn && <BookingCalendar />}

        {!user.isLoggedIn &&
            <Panel>
                <Typography variant='h1'>Tutlið booking</Typography>
                <Typography variant='body1'>{t('app:homePage.greeting')}</Typography>
                <br />
                <Button variant='contained' color='primary' component={Link} to='/login'>{t('common:button.login')}</Button>{' '}
                <Button variant='contained' color='primary' component={Link} to='/register'>{t('common:button.register')}</Button>
            </Panel>
        }
    </BasePage>

}