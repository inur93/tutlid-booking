import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { Calendar, Range } from './Calendar';
import { CreateBooking } from './CreateBooking';
import { CreateBookingModal } from './CreateBookingModal';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        }
    }),
);

export function BookingCalendar() {
    const classes = useStyles();
    const [bookings, setRange] = useBookings();
    const [show, setShow] = useState(false);
    const [defaultFrom, setDefaultFrom] = useState(new Date());
    const [defaultTo, setDefaultTo] = useState(new Date());

    const handleSelectSlot = ({ start, end }: Range) => {
        setDefaultFrom(start);
        setDefaultTo(end);
        setShow(true);
    }
    return (
        <div>
            {show && <CreateBookingModal onClose={() => setShow(false)} />}
            <Calendar
                events={bookings}
                onRangeChange={setRange}
                onSelectSlot={handleSelectSlot} />

        </div>)
}

