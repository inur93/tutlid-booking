import { Grid, List } from '@mui/material';
import React from 'react';
import { Booking } from '../../../api';
import { BookingListItem } from './BookingListItem';

type Props = {
    bookings: Booking[]
}

export default function BookingList({ bookings }: Props) {
    
    if (!bookings.length) return null;
    return (<Grid>
        <List dense>
            {bookings.map(x => <BookingListItem key={x._id} booking={x} />)}
        </List>
    </Grid>);
}