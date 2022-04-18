import { TFunction } from "i18next";
import { Booking } from "../api";


export function isAnonymous(booking: Booking): boolean {
    return !booking.bookedBy;
}

export function bookingCalendarTitle(booking: Booking, t: TFunction): string {
    if (isAnonymous(booking)) {
        return t('common:labels.occupied');
    }
    return `${booking.bookedBy.fullName} (${booking.guests || booking.tubCount})`;
}