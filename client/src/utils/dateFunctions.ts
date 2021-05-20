import { format } from "date-fns";
import { da, enGB } from 'date-fns/locale';

function getLocale(language: string) {
    switch (language) {
        // case 'fo': return fo;
        case 'da': return da;
        case "en": return enGB;
        default: return enGB;
    }
}

export function formatDate(date: Date | number | string, language: string) {
    const d = new Date(date);
    return format(d, 'do MMMM yyyy', { locale: getLocale(language) });
}

export function formatQueryDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
}

export function formatFormDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}