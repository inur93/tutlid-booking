import { Button, Card, CardContent, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Booking } from '../../api';
import { formatDate } from '../../utils/dateFunctions';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type BookingReceiptProps = {
    onClose: () => void,
    booking: Booking
}

export default function BookingReceipt({ onClose, booking }: BookingReceiptProps) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const from = formatDate(booking.from, i18n.language);
    const to = formatDate(booking.to, i18n.language);
    return (<Card>
        <CardContent>
            <Typography variant='body1'>
                {t('calendar.receipt_info', {
                    pplCount: booking.pplCount,
                    tubCount: booking.tubCount,
                    from, to,
                })}
            </Typography>

            <Button variant='contained' color='primary' onClick={onClose}>{t('shared.close')}</Button>
        </CardContent>
    </Card>);
}