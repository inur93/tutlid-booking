import { ObservableMap } from "mobx";
import { Translation } from "../types/Translation";
import { Map } from "../types/Types";

export function mapToTranslationArray(obj: any): Translation[] {
    return Object.keys(obj).map(x => ({
        language: x,
        content: obj[x]
    }))
}

export function copy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function toMap<T, V>(obj: T[], keySelector: (el: T) => string, valSelector: (el: T) => V): Map<V> {
    const initialVal = {} as Map<V>
    return obj.reduce((ret, x) => {
        ret[keySelector(x)] = valSelector(x);
        return ret;
    }, initialVal);
}

export function toObservableMap<T, V>(obj: T[], keySelector: (el: T) => string, valSelector: (el: T) => V): ObservableMap {
    return new ObservableMap(toMap(obj, keySelector, valSelector));
}

export function observableMap2list<T, V>(map: ObservableMap, selector: (key: string, val: V) => T): T[] {

    const iterator = map.keys();
    let entry = iterator.next();
    const results: T[] = [];
    while (!entry.done) {
        const value = map.get(entry.value);
        results.push(selector(entry.value, value));
        entry = iterator.next();
    }

    return results;
}
