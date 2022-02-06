import { Button, Grid, Typography } from '@material-ui/core';
import { startOfToday } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api, { Booking } from '../../api';
import { useData } from '../../hooks/useData';
import BookingList from '../admin/booking/BookingList';
import { ButtonContainer } from '../shared/ButtonContainer';
import { Spacer } from '../shared/Spacer';


type MyBookingsProps = {}
export default function MyBookings({ }: MyBookingsProps) {
    const { t } = useTranslation(['app', 'common']);
    const [{ data, loading }] = useData<Booking[]>(() => api.UserApi.myBookings(startOfToday()))
    return (<Grid>
        <Typography variant='h2'>{t('app:myBookings.title')}</Typography>
        {(data && !data.length && !loading) && <Typography variant='body1'>{t('app:myBookings.noBookings')}</Typography>}
        {data && <BookingList bookings={data} />}
        <Spacer />
        <ButtonContainer right>
            <Button color='primary' variant='contained' component={Link} to="/bookings/create">{t('common:button.new')}</Button>
        </ButtonContainer>
    </Grid>);
}