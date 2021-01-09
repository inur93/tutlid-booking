import { format } from "date-fns";
import daLocale from 'date-fns/locale/da';


export function formatDate(date: Date | number | string) {
    const d = new Date(date);
    return format(d, 'dd. MMMM yyyy', { locale: daLocale });
}