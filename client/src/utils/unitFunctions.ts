import { ItemStatus } from "../types/enums/ItemStatus";
import { Translation } from "../types/Translation";
import { Unit, UnitFormData } from "../types/Unit";
import { copy, observableMap2list, toMap, toObservableMap } from "./objectFunctions";
import { compare as compareJson } from "fast-json-patch";

export function unit2formData({ name, description, ...data }: Unit): UnitFormData {
    return {
        ...copy(data),
        name: toObservableMap(name, x => x.language, x => x.content),
        description: toObservableMap(description, x => x.language, x => x.content)
    }
}

export function formData2unit({ name, description, ...data }: UnitFormData): Unit {
    return {
        ...data,
        name: observableMap2list<Translation, string>(name, (key, val) => ({ language: key, content: val })),
        description: observableMap2list<Translation, string>(description, (key, val) => ({ language: key, content: val })),
    }
}

function stripViewData(unit: Unit) {
    const c = copy(unit);
    return {
        ...c,
        //we need to set the value to undefined when array is empty.
        //otherwise the patch request will be incorrect as it will try to add a value to the array
        //instead of creating the array
        addOns: (c.addOns?.length) ? c.addOns : undefined
    }
}
export function compare(src: Unit, target: Unit) {
    return compareJson(stripViewData(src), stripViewData(target));
}

export function emptyUnit(): Unit {
    return {
        isAddon: false,
        status: ItemStatus.Draft,
        name: [],
        description: [],
        addOns: []
    }
}