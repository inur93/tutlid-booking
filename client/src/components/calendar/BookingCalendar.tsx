import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { Calendar, Range } from './Calendar';
import { CreateBookingModal } from './CreateBookingModal';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 'calc(100vh - 90px)',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(2)
        }
    }),
);

export function BookingCalendar() {
    const classes = useStyles();
    const [bookings, setRange, error] = useBookings();
    const [show, setShow] = useState(false);
    const [defaultFrom, setDefaultFrom] = useState(new Date());
    const [defaultTo, setDefaultTo] = useState(new Date());

    const handleSelectSlot = ({ start, end }: Range) => {
        setDefaultFrom(start);
        setDefaultTo(end);
        setShow(true);
    }

    const handleCloseModal = () => {
        setShow(false);
        
    }
    return (
        <div className={classes.root}>
            {show && <CreateBookingModal from={defaultFrom} to={defaultTo} onClose={handleCloseModal} />}
            {!error && 
            <Calendar
                events={bookings}
                onRangeChange={setRange}
                onSelectSlot={handleSelectSlot} />
            }
            {error && <Alert severity='error'>{error}</Alert>}
        </div>)
}

