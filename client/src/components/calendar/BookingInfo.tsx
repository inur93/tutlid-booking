import { Button, Card, CardContent, makeStyles, Theme } from '@material-ui/core';
import {Alert} from '../shared/Alert';
import { format } from 'date-fns';
import React, { useState } from 'react';
import api, { Booking } from '../../api';
import { useAuthUser } from '../../hooks/useAuthUser';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

export type BookingInfoProps = {
    onClose: () => void,
    booking: Booking
}
const dateFormat = 'dd. MMM yyyy';
export default function BookingInfo({ onClose, booking }: BookingInfoProps) {
    const classes = useStyles();
    const [user] = useAuthUser();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = format(new Date(booking.from), dateFormat);
    const to = format(new Date(booking.to), dateFormat);
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
            <p>Overnættende gæster: {booking.pplCount}</p>
            <p>Pladser til varm pot: {booking.tubCount}</p>
            <Button variant='outlined' color='primary' onClick={onClose}>Luk</Button>{' '}
            {isOwner && <Button variant='contained' color='primary' onClick={handleDelete} disabled={loading}>Slet</Button>}
            {error && <Alert severity='error' >{error}</Alert>}
        </CardContent>
    </Card>);
}