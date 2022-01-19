import { Unit } from "./Unit";

export type SearchUnit = Pick<Unit, 'isAddon' | '_id' | 'unavailable'>
& Record<keyof Pick<Unit, 'name'>, string>
& Record<keyof Pick<Unit, 'description'>, string>
& Record<keyof Pick<Unit, 'addOns'>, SearchUnit[]>

