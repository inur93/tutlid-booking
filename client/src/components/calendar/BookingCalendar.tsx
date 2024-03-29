import {  Theme } from '@mui/material';
import {makeStyles} from 'tss-react/mui';
import { useEffect, useRef, useState } from 'react';
import { Booking } from '../../api';
import { useBookings } from '../../hooks/useBookings';
import { Alert } from '../shared/Alert';
import { BookingInfoModal } from './BookingInfoModal';
import { Calendar, Range } from './Calendar';
import { CreateBookingModal } from './CreateBookingModal';

const useStyles = makeStyles()((theme: Theme) =>
    ({
        root: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(2)
        }
    }),
);

export function BookingCalendar() {
    const { classes } = useStyles();
    const [{ bookings }, { setRange, load }, error] = useBookings();
    const [current, setCurrent] = useState<Booking>();
    const [showCreate, setShowCreate] = useState(false);
    const [defaultFrom, setDefaultFrom] = useState(new Date());
    const [defaultTo, setDefaultTo] = useState(new Date());
    const container = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (container.current) {
            setHeight(
                // height of parent component
                container.current.parentElement!.offsetHeight 
                // subtract this elements offset from the top
                - container.current.offsetTop 
                // and add the parents offset from the top to correct any padding and margins
                + container.current.parentElement!.offsetTop
                );
        }
    }, [container])
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
        <div ref={container} className={classes.root} style={{ height }}>
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

