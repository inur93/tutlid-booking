import { Unit } from "./Unit";
import { GetAdminPriceConfiguration } from "../priceConfiguration/GetAdminPriceConfiguration";

export type GetAdminAddOn = Pick<Unit, '_id' | 'description' | 'name' | 'status'>
export type GetAdminUnit = Omit<Unit, 'priceConfiguration' | 'addOnOptions'>
    & Record<keyof Pick<Unit, 'priceConfiguration'>, GetAdminPriceConfiguration[]>
    & Record<keyof Pick<Unit, 'addOnOptions'>, GetAdminAddOn[]>;