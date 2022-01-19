import { ObservableMap } from "mobx";
import { ItemStatus } from "./enums/ItemStatus";
import { Translation } from "./Translation";
import { Map } from "./Types";

export type Unit = {
    _id?: string,
    name: Translation[],
    description: Translation[],
    isAddon: boolean,
    status: ItemStatus,
    addOns: string[]
}

export type LocalizedUnit = Omit<Unit, 'name' | 'description'> & {
    _id?: string,
    name: string,
    description: string
}

export type UnitFormData = {
    _id?: string,
    name: ObservableMap,
    description: ObservableMap,
    isAddon: boolean,
    status: ItemStatus,
    addOns: string[]
}

export type CreateUnit = {

    name: Translation[],
    description: Translation[],
    isAddon: boolean
}