import { Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookingCalendar } from '../../components/calendar/BookingCalendar';
import { GalleryPreview } from '../../components/gallery/GalleryPreview';
import { ButtonContainer } from '../../components/shared/ButtonContainer';
import Panel from '../../components/shared/Panel';
import { Spacer } from '../../components/shared/Spacer';
import { useAuthUser } from '../../hooks/useAuthUser';
import { UltraWidePage, WidePage } from '../BasePage';

export function HomePage() {
    const [user] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);

    if (user.isLoggedIn) {
        return <UltraWidePage>
            <BookingCalendar />
        </UltraWidePage>
    }

    return <WidePage>
        <div>
            <Panel>
                <Typography variant='h1' component='h1'>Tutlið booking</Typography>
                <Typography variant='body1'>{t('app:homePage.greeting')}</Typography>
                <br />
                <ButtonContainer>
                    <Button data-cy='login-btn' variant='contained' color='primary' component={Link} to='/login'>{t('common:button.login')}</Button>
                    <Button data-cy='register-btn' variant='contained' color='primary' component={Link} to='/register'>{t('common:button.register')}</Button>
                </ButtonContainer>
            </Panel>
            <Spacer />
            <Panel >
                <GalleryPreview />
                <Spacer />
                <Typography variant='body1'>{t('app:homePage.gallery')}</Typography>
                <Spacer />
                <ButtonContainer>
                    <Button data-cy='gallery-btn' variant='contained' color='primary' component={Link} to={'/gallery'}>
                        {t('common:button.gallery')}
                    </Button>
                </ButtonContainer>
            </Panel>
        </div>
    </WidePage>

}