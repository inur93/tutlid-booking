import { debug } from "console";
import { action, makeAutoObservable, reaction, runInAction } from "mobx";
import { AdminApi } from "../api/adminApi";
import { ItemStatus } from "../types/enums/ItemStatus";
import { LocalizedUnit, Unit } from "../types/Unit";
import { translate } from "../utils/stringFunctions";
import { compare, emptyUnit } from "../utils/unitFunctions";
import { UnitListStore } from "./UnitListStore";
import { applyPatch } from 'fast-json-patch';

export class UnitStore {

    _id?: string = "";
    unit?: Unit = emptyUnit();
    language: string = 'en';
    loading: boolean = false;
    saving: boolean = false;
    busy: boolean = false;
    error: string = "";

    constructor(
        private readonly api: AdminApi,
        private readonly listStore?: UnitListStore
    ) {

        makeAutoObservable(this);
        reaction(
            () => this._id,
            (id) => this.reset(id)
        )
    }

    get localizedUnit(): LocalizedUnit | null {
        if (!this.unit) return null;
        return {
            ...this.unit,
            name: translate(this.unit.name, this.language),
            description: translate(this.unit.description, this.language)
        }
    }

    public init(id?: string): void {
        this._id = id;
    }

    public save(unit: Unit): Promise<void> {
        this.saving = true;
        this.error = "";

        const apply = applyPatch;
        const updates = compare(this.unit!, unit);

        const promise = unit._id ?
            this.api.updateUnit(unit._id, updates) :
            this.api.createUnit(unit);

        return promise
            .then(action((response) => {
                this._id = response.body._id;
                this.unit = response.body;
                //we do not want to wait for this load to finish.
                this.listStore?.load();
            }))
            .catch(action((e) => {
                this.error = e.message;
            }))
            .finally(action(() => {
                this.saving = false;
            }))

    }

    public reset(id?: string): Promise<void> {
        const unitId = id || this._id;
        if (!unitId) {
            //this is instant and does not setting loading state
            this.unit = emptyUnit();
        } else {

            this.loading = true;
            return this.api.getUnit(unitId)
                .then(action((response) => {
                    this.unit = response.body;
                }))
                .finally(action(() => {
                    this.loading = false;
                }))
        }

        return Promise.resolve();

    }

    public delete(): Promise<void> {

        if (!this._id) return Promise.resolve();

        this.busy = true;
        this.error = "";

        return this.api.deleteUnit(this._id)
            .then(action(() => {
                this.init();
                this.listStore?.load();
            }))
            .catch(action((e) => {
                this.error = e.message || `Could not delete ${this.unit?.name}`;
            }))
            .finally(action(() => {
                this.busy = false;
            }))
    }

}