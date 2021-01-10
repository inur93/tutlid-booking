import { Card, CardContent, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import ApproveIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import RejectIcon from '@material-ui/icons/HighlightOffRounded';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Booking, BookingStatus } from '../../api';
import { usePendingBookings } from '../../hooks/usePendingBookings';
import { formatDate } from '../../utils/dateFunctions';

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
type PendingBookingsPanelProps = {}

type BookingRequestProps = {
    booking: Booking,
    onClick: (id: string, status: BookingStatus) => Promise<void>
}

function BookingRequest({ booking, onClick }: BookingRequestProps) {
    const classes = useRequestStyles();
    const handleAction = (status: BookingStatus) => () => onClick(booking._id, status);
    const { t, i18n } = useTranslation();
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

export default function PendingBookingsPanel({ }: PendingBookingsPanelProps) {
    const classes = useStyles();
    const [{ bookings }, reply] = usePendingBookings();
    const { t } = useTranslation();
    if (!bookings.length) return null;

    return (<Card>
        <CardContent>
            <Typography variant='h6'>{t('admin.bookings_pending_admin_approval')}</Typography>
            <List dense>
                {bookings.map(x => <BookingRequest key={x._id} booking={x} onClick={reply} />)}
            </List>
        </CardContent>

    </Card>);
}