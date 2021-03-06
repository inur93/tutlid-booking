import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Typography } from '@material-ui/core';
import api, { Booking, BookingStatus, Role } from '../../api';
import BookingList from '../../components/admin/booking/BookingList';
import PendingBookingsList from '../../components/admin/booking/PendingBookingsList';
import Panel from '../../components/shared/Panel';
import ProtectedComponent from '../../components/shared/ProtectedComponent';
import { useBookings } from '../../hooks/useBookings';
import { BasePage } from '../BasePage';
import { useData } from '../../hooks/useData';
import { useEffect } from 'react';

export default function BookingsPage() {
    const [{ bookings }, { load: loadBookings }] = useBookings(false, BookingStatus.reserved);
    const [numBookings, setNumBookings] = useState(5);
    const [{
        data: upcomingBookings,
        loading: loadingUpcomingBookings
    }, loadUpcomingBookings] = useData<Booking[]>(() => api.AdminApi.getBookings(new Date(), numBookings));
    useEffect(() => {
        loadUpcomingBookings();
    }, [numBookings]);
    const { t } = useTranslation('app');
    const changeBookingStatus = async (id: string, status: BookingStatus, messageFromAdmin?: string) => {
        await api.AdminApi.changeBookingStatus(id, {
            status, messageFromAdmin
        });
        await loadBookings();
        await loadUpcomingBookings();
    }

    const count = numBookings > (upcomingBookings?.length || 5) ? upcomingBookings?.length : numBookings;
    return (<ProtectedComponent requiredRoles={[Role.basic]}>
        <BasePage >
            <Panel>
                <Typography variant='h6'>{t('app:bookingsPage.pendingBookingsHeader')}</Typography>
                <PendingBookingsList bookings={bookings} changeStatus={changeBookingStatus} />

                <Typography variant='h6'>{t('app:bookingsPage.upcomingBookingsHeader', { count })}</Typography>
                {(!loadingUpcomingBookings && upcomingBookings && !upcomingBookings.length) &&
                    <Typography variant='body1'>{t('app:bookingsPage.noUpcomingBookingsLabel')}</Typography>}
                <BookingList bookings={upcomingBookings || []} />
                <Grid container justify='center'>
                    {numBookings <= (upcomingBookings?.length || 0) &&
                        <Button color='primary' variant='outlined' onClick={() => setNumBookings((c) => c + 5)} >
                            {t('app:bookingsPage.loadMore')}
                        </Button>
                    }
                </Grid>
            </Panel>
        </BasePage>
    </ProtectedComponent>);
}