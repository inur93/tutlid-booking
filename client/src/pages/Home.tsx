import { Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookingCalendar } from '../components/calendar/BookingCalendar';
import { GalleryPreview } from '../components/gallery/GalleryPreview';
import Panel from '../components/shared/Panel';
import { useAuthUser } from '../hooks/useAuthUser';
import { BasePage } from './BasePage';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            '& > .MuiCard-root': {
                marginBottom: theme.spacing(2)
            }
        },
        gallery: {
            height: '400px',
            marginBottom: theme.spacing(2)
        }
    })
);


export function Home() {
    const classes = useStyles();
    const [user] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);

    return <BasePage fullWidth={user.isLoggedIn} >
        {user.isLoggedIn && <BookingCalendar />}

        {!user.isLoggedIn &&
            <div className={classes.wrapper}>
                <Panel>
                    <Typography variant='h1'>Tutlið booking</Typography>
                    <Typography variant='body1'>{t('app:homePage.greeting')}</Typography>
                    <br />
                    <Button variant='contained' color='primary' component={Link} to='/login'>{t('common:button.login')}</Button>{' '}
                    <Button variant='contained' color='primary' component={Link} to='/register'>{t('common:button.register')}</Button>
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

}