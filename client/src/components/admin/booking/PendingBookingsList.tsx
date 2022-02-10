import { Grid, List } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Booking, BookingStatus } from '../../../api';
import MessageModal from '../../shared/MessageModal';
import { PendingBookingListItem } from './PendingBookingListItem';

type PendingBookingsPanelProps = {
    bookings: Booking[],
    changeStatus: (id: string, status: BookingStatus, message?: string) => Promise<void>
}

type ChangeStatusDetails = {
    id: string,
    status: BookingStatus,

}
export default function PendingBookingsList({ bookings, changeStatus }: PendingBookingsPanelProps) {
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

    return (<Grid>
        <List dense>
            {bookings.map(x => <PendingBookingListItem key={x._id} booking={x} onClick={handleAction} />)}
        </List>
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
    </Grid>);
}