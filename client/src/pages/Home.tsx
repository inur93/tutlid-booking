


import { Card, CardContent, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { BookingCalendar } from '../components/calendar/BookingCalendar';
import { Calendar } from '../components/calendar/Calendar';
import RegisterUser from '../components/register/Register';
import { useAuthUser } from '../hooks/useAuthUser';
import { RegisterPage } from './RegisterPage';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

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
    if (user.isLoggedIn) return (<div>
        <BookingCalendar />
    </div>)

    return <Grid className={classes.root} container justify='center'>
        <Grid item xs={12} md={8} lg={6}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant='h1'>Tutlið booking</Typography>
                    <Typography variant='body1'>Welcome to Tutlið booking. If you havent registered already, do so below.
                    Otherwise log in <Link to='/login'>here</Link></Typography>
                </CardContent>
            </Card>

            <RegisterUser header='Register new user' />
        </Grid>
    </Grid>

}