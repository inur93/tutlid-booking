import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import api, { Booking, BookingStatus } from '../api';

type Range = { start: Date, end: Date };
type UseBookingsType = [
    {
        bookings: Booking[],
        loading: boolean
    },
    {
        setRange: (range: Range) => void,
        load: () => void
    },
    string //error
]

export function useBookings(useRange: boolean = true, status?: BookingStatus): UseBookingsType {
    const [start, setStart] = useState(startOfMonth(new Date()));
    const [end, setEnd] = useState(endOfMonth(new Date()));
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const load = async () => {
        setLoading(true);
        try {
            const query = {
                from: useRange ? start : undefined,
                to: useRange ? end : undefined,
                status
            }
            const response = await api.BookingApi.getBookings(query)
            setBookings(response.body);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };
    useEffect(() => {
        load();
    }, [start, end, status, useRange]);

    const setRange = (range: Range) => {
        setStart(range.start);
        setEnd(range.end);
    }
    
    return [{ bookings, loading }, { setRange, load }, error];
}