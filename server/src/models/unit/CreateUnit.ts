import { ItemStatus } from "../common/ItemStatus";
import { Period } from "../common/Period";
import { Translation } from "../common/Translation";
import { PriceConfiguration } from "../priceConfiguration/PriceConfiguration";
import { Unit } from "./Unit";
import { UnitType } from "./UnitType";
// export type CreateUnit = 
type _Type = Omit<Unit, '_id' | 'status' | 'addOnOptions' | 'priceConfiguration'>
export class CreateUnit implements _Type {

    public name!: Translation[];
    public description?: Translation[] | undefined;
    public type!: UnitType;
    public unavailable!: Period[];
}
