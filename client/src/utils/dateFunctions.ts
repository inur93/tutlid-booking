import { format } from "date-fns";
import { da, enGB } from 'date-fns/locale';

export function getLanguages() {
    return ['da', 'en']
}

export function getCurrentLanguage(): string {
    return localStorage.getItem('language') || 'da';
}

export function setCurrentLanguage(language: string) {
    localStorage.setItem('language', language)
}

export function getLocale(language: string) {
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

export function formatFormDate(date: Date): string  {
    return format(date, 'yyyy-MM-dd');
}