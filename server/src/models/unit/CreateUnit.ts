import { ArrayMinSize, Length, ValidateNested } from "class-validator";
import { Period } from "../common/Period";
import { Translation } from "../common/Translation";
import { Unit } from "./Unit";
// export type CreateUnit = 
type _Type = Omit<Unit, '_id' | 'status' | 'addOns' | 'priceConfiguration'>
export class CreateUnit implements _Type {


    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    public name!: Translation[];
    
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    public description?: Translation[] | undefined;
    
    public isAddon!: boolean;

    @ValidateNested({ each: true })
    public unavailable!: Period[];
}
