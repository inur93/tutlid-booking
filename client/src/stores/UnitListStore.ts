import { action, makeAutoObservable } from "mobx";
import { AdminApi } from "../api/adminApi";
import { LocalizedUnit, Unit } from "../types/Unit";
import { translate } from "../utils/stringFunctions";

export class UnitListStore {

    units: Unit[] = [];
    loading: boolean = false;
    error: string = "";

    constructor(
        private readonly api: AdminApi
    ) {
        makeAutoObservable(this);
    }

    public load(): Promise<void> {
        this.loading = true;
        this.error = "";

        return this.api.findUnits()
            .then(action((response) => {
                this.units = response.body;
            }))
            .catch(action((e) => {
                this.error = e.message || 'Could not load any units';
            }))
            .finally(action(() => {
                this.loading = false;
            }))
    }

    public delete(id: string): Promise<void> {
        this.loading = true;
        return this.api.deleteUnit(id)
            .then(this.load)
            .finally(action(() => {
                this.loading = false;
            }))
    }

}