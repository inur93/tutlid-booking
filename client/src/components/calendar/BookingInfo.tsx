import { Button, Card, CardContent } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { Booking } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import { formatDate } from '../../utils/dateFunctions';
import { Alert } from '../shared/Alert';

export type BookingInfoProps = {
    onClose: () => void,
    booking: Booking
}

export default function BookingInfo({ onClose, booking }: BookingInfoProps) {
    const [user] = useAuthUser();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation(['app', 'common']);

    const from = formatDate(booking.from, i18n.language);
    const to = formatDate(booking.to, i18n.language);

    const isOwner = user?._id === booking.bookedBy._id;

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.BookingApi.delete(booking._id);
            onClose();
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }
    return (<Card>
        <CardContent>
            <p>{booking.bookedBy.fullName}</p>
            <p>{from} - {to}</p>
            <p>{t('app:bookingInfo.description1', { pplCount: booking.pplCount })}</p>
            <p>{t('app:bookingInfo.description2', { tubCount: booking.tubCount })}</p>
            <Button variant='outlined'
                color='primary'
                onClick={onClose}>{t('common:button.close')}</Button>{' '}
            {isOwner && <Button variant='contained'
                color='primary'
                onClick={handleDelete}
                disabled={loading}>{t('common:button.delete')}</Button>}
            {error && <Alert severity='error' >{error}</Alert>}
        </CardContent>
    </Card>);
}