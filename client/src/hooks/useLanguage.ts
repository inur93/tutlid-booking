import { I18nContext } from "react-i18next";
import { useContext } from "react";


export function useLanguage(): [string, (lang: string) => void] {
    const { i18n } = useContext(I18nContext);

    const setLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    }
    return [i18n.language || 'da', setLanguage];
}