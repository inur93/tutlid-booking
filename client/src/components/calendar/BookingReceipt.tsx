import React from 'react';
import { Card, createStyles, makeStyles, Theme, CardContent, Button } from '@material-ui/core';
import clsx from 'clsx';
import { Booking } from '../../api';
import { format } from 'date-fns';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type BookingReceiptProps = {
    onClose: () => void,
    booking: Booking
}
const dateFormat = 'dd. MMM yyyy';
export default function BookingReceipt({ onClose, booking }: BookingReceiptProps) {
    const classes = useStyles();

    const from = format(new Date(booking.from), dateFormat);
    const to = format(new Date(booking.to), dateFormat);
    return (<Card>
        <CardContent>
            <p>Din booking for <b>{booking.pplCount}</b> overnættende gæster og <b>{booking.tubCount}</b> pladser til den varme pot i perioden <b>{from}</b> til <b>{to}</b> er registreret.</p>
            <p>Du har modtaget en kvitteringsemail med de samme oplysninger som står her.</p>
            <p>Når booking er bekræftet vil du modtage en bekræftelses email.</p>
            <Button variant='contained' color='primary' onClick={onClose}>Luk</Button>
        </CardContent>
    </Card>);
}