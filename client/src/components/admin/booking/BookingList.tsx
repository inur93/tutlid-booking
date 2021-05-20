import { Grid, List } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Booking } from '../../../api';
import { BookingListItem } from './BookingListItem';

type Props = {
    bookings: Booking[]
}

export default function BookingList({ bookings }: Props) {
    const { t } = useTranslation('app');
    
    if (!bookings.length) return null;

    return (<Grid>
        <List dense>
            {bookings.map(x => <BookingListItem key={x._id} booking={x} />)}
        </List>
    </Grid>);
}