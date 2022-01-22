import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import ApproveIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import RejectIcon from '@material-ui/icons/HighlightOffRounded';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Booking, BookingStatus } from '../../../api';
import { formatDate } from '../../../utils/dateFunctions';

const useStyles = makeStyles((theme: Theme) =>
({
    compactActions: {
        right: '4px'
    },
    compactIcon: {
        padding: '8px'
    },
    'approve': {
        color: green[500]
    },
    'reject': {
        color: red[500]
    }
}));

type Props = {
    booking: Booking,
    onClick: (id: string, status: BookingStatus) => Promise<void>
}


export function PendingBookingListItem({ booking, onClick }: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const handleAction = (status: BookingStatus) => () => onClick(booking._id, status);
    const { t, i18n } = useTranslation('app');
    const from = formatDate(booking.from, i18n.language);
    const to = formatDate(booking.to, i18n.language);

    const primary = t('app:pendingBookings.label', { replace: { name: booking.bookedBy.fullName, count: booking.pplCount || booking.tubCount } });
    const secondary = `${from} - ${to}`;

    return <ListItem>
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction className={classNames(isSmall && classes.compactActions)}>
            <IconButton className={classNames(isSmall && classes.compactIcon)} edge='end' aria-label='approve' onClick={handleAction(BookingStatus.accepted)}>
                <ApproveIcon className={classes.approve} />
            </IconButton>
            <IconButton className={classNames(isSmall && classes.compactIcon)} edge='end' aria-label='reject' onClick={handleAction(BookingStatus.declined)}>
                <RejectIcon className={classes.reject} />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
}