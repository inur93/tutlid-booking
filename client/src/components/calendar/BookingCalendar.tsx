import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import { Booking } from '../../api';
import { useBookings } from '../../hooks/useBookings';
import { Alert } from '../shared/Alert';
import { BookingInfoModal } from './BookingInfoModal';
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
    const [{ bookings }, { setRange, load }, error] = useBookings();
    const [current, setCurrent] = useState<Booking>();
    const [showCreate, setShowCreate] = useState(false);
    const [defaultFrom, setDefaultFrom] = useState(new Date());
    const [defaultTo, setDefaultTo] = useState(new Date());
    
    const handleSelectSlot = ({ start, end }: Range) => {
        setDefaultFrom(start);
        setDefaultTo(end);
        setShowCreate(true);
    }

    const handleSelectEvent = (booking: Booking) => {
        setCurrent(booking);
    }
    const handleCloseModal = () => {
        setShowCreate(false);
        setCurrent(undefined);
        load();
    }
    return (
        <div className={classes.root}>
            {showCreate && <CreateBookingModal from={defaultFrom} to={defaultTo} onClose={handleCloseModal} />}
            {current && <BookingInfoModal booking={current} onClose={handleCloseModal} />}

            <Calendar
                events={bookings}
                onSelectEvent={handleSelectEvent}
                onRangeChange={setRange}
                onSelectSlot={handleSelectSlot} />

            {error && <Alert severity='error'>{error}</Alert>}
        </div>)
}

