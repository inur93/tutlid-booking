import { useEffect, useState } from 'react';
import api, { Booking, BookingStatus } from '../api/index';



type usePendingBookingsProps = [
    {
        bookings: Booking[],
        loading: boolean
    },
    (id: string, status: BookingStatus) => Promise<void>
]
export function usePendingBookings(): usePendingBookingsProps {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.AdminApi.getBookingsPendingApproval();
            setBookings(res.body || []);
        } catch (e) {
            console.log('could not load bookings', e);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const respond = async (id: string, status: BookingStatus) => {
        await api.AdminApi.respondPendingBooking(id, status);
        await load();
    }
    return [{ bookings, loading }, respond]
}