import { History } from "history";
import { action, autorun, makeAutoObservable, reaction } from "mobx";
import { FormEvent } from "react-transition-group/node_modules/@types/react";
import { getCurrentLanguage } from "../../../i18n";
import { UnitListStore } from "../../../stores/UnitListStore";
import { UnitStore } from "../../../stores/UnitStore";
import { LocalizedUnit, Unit, UnitFormData } from "../../../types/Unit";
import { translate } from "../../../utils/stringFunctions";
import { emptyUnit, formData2unit, unit2formData } from "../../../utils/unitFunctions";

function makeUnitObservable(unit?: Unit): UnitFormData {
    return unit2formData(unit ?? emptyUnit());
}
export class UnitUiStore {

    private _language: string = getCurrentLanguage();
    private _form: UnitFormData = makeUnitObservable();
    private _promptDelete: boolean = false;

    private _history?: History<unknown>;

    constructor(
        private unitStore: UnitStore,
        private unitListStore: UnitListStore
    ) {
        // all fields must be initialized before calling this method
        makeAutoObservable(this);
        autorun(() => {
            this.setForm(makeUnitObservable(this.unitStore.unit));
        })
    }

    public setForm(form: UnitFormData) {
        this._form = form;
    }
    public set id(id: string) {
        this.unitStore.init(id);
    }

    public set history(history: History<unknown>) {
        this._history = history;
    }

    public get optionsLoading() {
        return this.unitListStore.loading;
    }

    get localizedUnits(): LocalizedUnit[] {
        return this.unitListStore.units.map(unit => ({
            ...unit,
            name: translate(unit.name, this.language),
            description: translate(unit.description, this.language)
        }));
    }

    public get addOnOptions(): Unit[] {
        return this.unitListStore.units
            .filter(x => x.isAddon)
    }

    public set addons(units: LocalizedUnit[]) {

    }

    public setAddonOptions(values: Unit[]) {
        this._form.addOnOptions = values;
    }
    // public get addons(){

    // }

    public loadOptions() {
        this.unitListStore.load();
    }

    public get saving() {
        return this.unitStore.saving;
    }

    public get error() {
        return this.unitStore.error;
    }

    public get name() {
        return this._form.name.get(this._language) || '';
    }

    public set name(content: string) {
        this._form.name.set(this._language, content);
    }

    public get description() {
        return this._form.description.get(this._language) || '';
    }

    public set description(content: string) {
        this._form.description.set(this._language, content);
    }

    public set isAddon(checked: boolean) {
        this._form.isAddon = checked;
    }

    public get isAddon() {
        return this._form.isAddon;
    }

    public set language(language: string) {
        this._language = language;
    }

    public get language() {
        return this._language;
    }

    public get promptDelete() {
        return this._promptDelete;
    }

    public set promptDelete(prompt: boolean) {
        this._promptDelete = prompt;
    }

    public get isEdit() {
        return Boolean(this._form._id);
    }

    public submit = (e: FormEvent): Promise<void> => {
        if (e) e.preventDefault();
        const data  = formData2unit(this._form);
        
        return this.unitStore.save(data)
            .then(action(() => {
                if (!this.unitStore.error) {
                    this._history?.replace(`/admin/units/${this.unitStore._id}`)
                }
            }))
    }

    public delete(): Promise<void> {

        return this.unitStore.delete()
            .then(action(() => {
                this.promptDelete = false;
                if (!this.error) {
                    this._history?.push('/admin');
                }
            }));
    }
}