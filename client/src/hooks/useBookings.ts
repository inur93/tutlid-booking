import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import api, { Booking } from '../api';

type Range = { start: Date, end: Date };
type UseBookingsType = [
    Booking[],
    {
        setRange: (range: Range) => void,
        load: () => void
    },
    string //error
]

export function useBookings(): UseBookingsType {
    const [start, setStart] = useState(startOfMonth(new Date()));
    const [end, setEnd] = useState(endOfMonth(new Date()));
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const load = async () => {
        try {
            const response = await api.BookingApi.getBookings(start, end)
            setBookings(response.body);
        } catch (e) {
            setError(e.message);
        }
    };
    useEffect(() => {
        load();
    }, [start, end]);

    const setRange = (range: Range) => {
        setStart(range.start);
        setEnd(range.end);
    }
    return [bookings, { setRange, load }, error];
}