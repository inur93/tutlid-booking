import { Card, CardContent, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import ApproveIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import RejectIcon from '@material-ui/icons/HighlightOffRounded';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Booking, BookingStatus } from '../../api';
import { formatDate } from '../../utils/dateFunctions';
import MessageModal from './MessageModal';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

const useRequestStyles = makeStyles((theme: Theme) =>
({
    'approve': {
        color: green[500]
    },
    'reject': {
        color: red[500]
    }
}));
type PendingBookingsPanelProps = {
    bookings: Booking[],
    changeStatus: (id: string, status: BookingStatus, message?: string) => Promise<void>
}

type BookingRequestProps = {
    booking: Booking,
    onClick: (id: string, status: BookingStatus) => Promise<void>
}

function BookingRequest({ booking, onClick }: BookingRequestProps) {
    const classes = useRequestStyles();
    const handleAction = (status: BookingStatus) => () => onClick(booking._id, status);
    const { i18n } = useTranslation();
    const from = formatDate(booking.from, i18n.language);
    const to = formatDate(booking.to, i18n.language);

    const primary = `${booking.bookedBy.fullName} (${booking.pplCount || booking.tubCount} people)`;
    const secondary = `${from} - ${to}`;

    return <ListItem>
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
            <IconButton edge='end' aria-label='approve' onClick={handleAction(BookingStatus.accepted)}>
                <ApproveIcon className={classes.approve} />
            </IconButton>
            <IconButton edge='end' aria-label='reject' onClick={handleAction(BookingStatus.declined)}>
                <RejectIcon className={classes.reject} />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
}

type ChangeStatusDetails = {
    id: string,
    status: BookingStatus,

}
export default function PendingBookingsPanel({ bookings, changeStatus }: PendingBookingsPanelProps) {
    const classes = useStyles();
    const [details, setDetails] = useState<ChangeStatusDetails>();
    const { t } = useTranslation('app');
    const handleAction = async (id: string, status: BookingStatus) => {
        setDetails({
            id, status
        })
    }

    const onAccept = async (message: string) => {
        details && await changeStatus(details.id, details.status, message);
        setDetails(undefined);
    }

    const onCancel = () => {
        setDetails(undefined);
    }
    if (!bookings.length) return null;

    return (<Card className={classes.root}>
        <CardContent>
            <Typography variant='h6'>{t('app:pendingBookingsPanel.header')}</Typography>
            <List dense>
                {bookings.map(x => <BookingRequest key={x._id} booking={x} onClick={handleAction} />)}
            </List>
        </CardContent>
        {details && <MessageModal
            onClose={onCancel}
            onAccept={onAccept}
            cancelLabel={t('common:button.cancel')}
            header={details.status === BookingStatus.accepted
                ? t('app:pendingBookingsPanel.confirmationMsgHeader')
                : t('app:pendingBookingsPanel.declineMsgHeader')}
            fieldLabel={details.status === BookingStatus.accepted
                ? t('app:pendingBookingsPanel.confirmationMsgLabel')
                : t('app:pendingBookingsPanel.declineMsgLabel')}
            submitLabel={t('common:button.confirm')} />}
    </Card>);
}