import HotTubIcon from '@mui/icons-material/HotTub';
import PeopleIcon from '@mui/icons-material/People';
import { Badge, ListItem, ListItemSecondaryAction, ListItemText, Theme } from '@mui/material';
import { differenceInDays } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { Booking } from '../../../api';
import { isAnonymous } from '../../../utils/bookingFunctions';
import { formatDate } from '../../../utils/dateFunctions';

const useStyles = makeStyles()((theme: Theme) =>
({
    badge: {
        marginRight: theme.spacing(1)
    }
}));

type Props = {
    booking: Booking
}

export function BookingListItem({ booking }: Props) {
    const { classes } = useStyles();
    const { i18n, t } = useTranslation();
    const from = formatDate(booking.from, i18n.language);
    const to = formatDate(booking.to, i18n.language);

    const count = differenceInDays(new Date(booking.to), new Date(booking.from));
    const isUnknown = isAnonymous(booking);
    const primary = `${from} - ${to} (${t('common:labels.days', { count })})`;
    const secondary = isUnknown ? t('common:labels.occupied') : `${booking.bookedBy.fullName}`;

    return <ListItem>
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction >
            <Badge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                className={classes.badge}
                badgeContent={booking.guests}
                color='primary'>
                <PeopleIcon />
            </Badge>
            <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} badgeContent={booking.tubCount} color='primary'>
                <HotTubIcon />
            </Badge>
        </ListItemSecondaryAction>
    </ListItem>
}
