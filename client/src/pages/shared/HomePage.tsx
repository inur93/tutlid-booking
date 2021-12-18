import { Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookingCalendar } from '../../components/calendar/BookingCalendar';
import { GalleryPreview } from '../../components/gallery/GalleryPreview';
import { ButtonContainer } from '../../components/shared/ButtonContainer';
import Panel from '../../components/shared/Panel';
import { useContainer } from '../../ioc';
import { BasePage } from '../BasePage';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            '& > .MuiCard-root': {
                marginBottom: theme.spacing(2)
            }
        },
        gallery: {
            marginBottom: theme.spacing(2)
        }
    })
);


export const HomePage = observer(() => {
    const classes = useStyles();
    const { authStore: user } = useContainer();
    const { t } = useTranslation(['app', 'common']);

    return <BasePage fullWidth={user?.loggedIn} >
        {user?.loggedIn && <BookingCalendar />}

        {!user?.loggedIn &&
            <div className={classes.wrapper}>
                <Panel>
                    <Typography variant='h3' component='h1'>Tutlið booking</Typography>
                    <Typography variant='body1'>{t('app:homePage.greeting')}</Typography>
                    <br />
                    <ButtonContainer>
                        <Button variant='contained' color='primary' component={Link} to='/login'>{t('common:button.login')}</Button>
                        <Button variant='contained' color='primary' component={Link} to='/register'>{t('common:button.register')}</Button>
                    </ButtonContainer>
                </Panel>
                <Panel >
                    <div className={classes.gallery}>
                        <GalleryPreview />
                    </div>
                    <Typography variant='body1'>{t('app:homePage.gallery')}</Typography>
                    <Button variant='contained' color='primary' component={Link} to={'/gallery'}>
                        {t('common:button.gallery')}
                    </Button>
                </Panel>
            </div>
        }
    </BasePage>
})
