


import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { BookingCalendar } from '../components/calendar/BookingCalendar';
import { Calendar } from '../components/calendar/Calendar';
import { useAuthUser } from '../hooks/useAuthUser';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        }
    }),
);

export function Home() {
    const classes = useStyles();
    const [user] = useAuthUser();
    if(!user) return <div/>;
    return (<div>
        <BookingCalendar />
    </div>)
}