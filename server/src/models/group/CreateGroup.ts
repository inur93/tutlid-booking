import { ArrayMinSize, IsUUID, ValidateNested } from "class-validator";
import { Translation } from "../common/Translation";
import { Group } from "./Group";

type _Type = Omit<Group, '_id' | 'users'>
    & Record<keyof Pick<Group, 'users'>, string[]>
export class CreateGroup implements _Type {


    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    public name!: Translation[];

    @IsUUID("5", { each: true })
    public users!: string[];
}
