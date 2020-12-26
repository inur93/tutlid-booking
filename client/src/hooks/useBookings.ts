import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import api, { Booking } from '../api';

type Range = { start: Date, end: Date };
type UseBookingsType = [Booking[], (range: Range) => void]

export function useBookings(): UseBookingsType {
    const [start, setStart] = useState(startOfMonth(new Date()));
    const [end, setEnd] = useState(endOfMonth(new Date()));
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const load = async () => {
            const response = await api.BookingApi.getBookings(start, end)
            setBookings(response.body);
        };
        load();
    }, [start, end]);

    const setRange = (range: Range) => {
        setStart(range.start);
        setEnd(range.end);
    }
    return [bookings, setRange];
}