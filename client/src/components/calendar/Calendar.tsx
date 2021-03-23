import { createStyles, makeStyles, Theme } from '@material-ui/core';
import classNames from 'classnames';
import { endOfYesterday, format, getDay, parse, startOfWeek } from 'date-fns';
import { da, enGB } from 'date-fns/locale';
import { Calendar as BaseCalendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';
import { Booking } from '../../api';
const locales = {
    'da': da,
    'en': enGB
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100%'
        },
        invalidDate: {
            background: `repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 10px, #DDD 10px, #DDD 20px)`,
            opacity: 0.6
        },
        event: {
            backgroundColor: '#1ece44',
            opacity: 0.8
        },
        validDate: {
            opacity: 0.6
        }
    }),
);

export type Range = {
    start: Date,
    end: Date
}
type CalendarProps = {
    onRangeChange?: (range: Range) => void,
    onSelectEvent?: (event: Booking) => void,
    onSelectSlot?: (range: Range) => void
    events: Booking[]
}
export function Calendar({ onRangeChange, onSelectEvent, onSelectSlot, events }: CalendarProps) {
    const classes = useStyles();
    const {t, i18n} = useTranslation('app');
    const handleRangeChange = (range: any) => {
        if (onRangeChange) {
            onRangeChange({
                start: range.start as Date,
                end: range.end as Date
            })
        }
    }

    const handleSelectSlot = (range: any) => {
        if (onSelectSlot) {
            onSelectSlot({
                start: range.start as Date,
                end: range.end as Date
            })
        }
    }
    return (<BaseCalendar
        localizer={localizer}
        culture={i18n.language}
        messages={{
            today: t('app:calendar.todayLabel'),
            next: t('app:calendar.nextLabel'),
            previous: t('app:calendar.previousLabel')
        }}
        className={classes.root}
        views={['month']}
        selectable={'ignoreEvents'}
        onRangeChange={handleRangeChange}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={onSelectEvent}
        events={events}

        dayPropGetter={(date, resource) => {
            if (date < endOfYesterday()) return { className: classes.invalidDate };
            return {className: classes.validDate};
        }}
        eventPropGetter={(event, start, end, selected) => {
            return {
                className: classNames(classes.event, selected ? 'selected' : '')
            }
        }}

        titleAccessor={(booking) => `${booking.bookedBy.fullName} (${booking.pplCount || booking.tubCount})`}
        startAccessor={(booking) => booking.from}
        endAccessor={(booking) => booking.to}
        allDayAccessor={() => true}
        tooltipAccessor={(booking) => booking.comment}
    />)
}