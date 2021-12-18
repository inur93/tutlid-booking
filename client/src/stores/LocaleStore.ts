import { autorun, makeAutoObservable } from "mobx";
import i18n, { getCurrentLanguage } from "../i18n";

export class LocaleStore {

    language: string = getCurrentLanguage();

    constructor() {
        makeAutoObservable(this);
        autorun(() => i18n.changeLanguage(this.language));
    }

    public setLanguage(lang: string) {
        this.language = lang;
    }
}