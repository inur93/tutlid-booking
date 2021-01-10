import { Button, Card, CardContent, makeStyles, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { Booking } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';
import { formatDate } from '../../utils/dateFunctions';
import { Alert } from '../shared/Alert';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

export type BookingInfoProps = {
    onClose: () => void,
    booking: Booking
}

export default function BookingInfo({ onClose, booking }: BookingInfoProps) {
    const classes = useStyles();
    const [user] = useAuthUser();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

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
            <p>{t('calendar.overnight_guests', { pplCount: booking.pplCount })}</p>
            <p>{t('calendar.tub_guests', { tubCount: booking.tubCount })}</p>
            <Button variant='outlined'
                color='primary'
                onClick={onClose}>{t('shared.close')}</Button>{' '}
            {isOwner && <Button variant='contained'
                color='primary'
                onClick={handleDelete}
                disabled={loading}>{t('shared.delete')}</Button>}
            {error && <Alert severity='error' >{error}</Alert>}
        </CardContent>
    </Card>);
}