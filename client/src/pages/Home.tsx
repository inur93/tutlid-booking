


import { Card, CardContent, createStyles, Grid, makeStyles, Theme, Typography, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookingCalendar } from '../components/calendar/BookingCalendar';
import RegisterUser from '../components/register/Register';
import { useAuthUser } from '../hooks/useAuthUser';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        card: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        }
    }),
);

export function Home() {
    const classes = useStyles();
    const [user] = useAuthUser();
    const {t, i18n} = useTranslation();

    if (user.isLoggedIn) return (<div>
        <BookingCalendar />
    </div>)

    return <Grid className={classes.root} container justify='center'>
        <Grid item xs={12} md={8} lg={6}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant='h1'>Tutlið booking</Typography>
                    <Typography variant='body1'>{t('components.home.greeting')}</Typography>
                    <Button variant='contained' color='primary' component={Link} to='/login'>{t('shared.login')}</Button>
                </CardContent>
            </Card>

            <RegisterUser header={t('shared.registerNew')} />
        </Grid>
    </Grid>

}