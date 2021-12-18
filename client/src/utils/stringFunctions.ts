import { Translation } from "../types/Translation";

export function getInitials(name: string) {
    if (!name) return '';
    //TODO instead of trying to remove all special characters, take the first and check if it is a letter. if not take the next.
    const parts = name.replaceAll(/\*|-|\+|!|\(|\)|#|\$/g, '').split(' ');
    if (parts.length < 2) return parts[0][0].toUpperCase();
    return `${parts[0][0].toUpperCase()}${parts[parts.length - 1][0].toUpperCase()}`;
}

export function translate(translations: Translation[], language: string) {
    return translations.find(x => x.language === language)?.content || '';
}