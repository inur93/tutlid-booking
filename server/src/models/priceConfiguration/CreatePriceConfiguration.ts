import { IsEnum, IsInt, IsNumber, IsOptional, IsUUID, Min, ValidateNested } from "class-validator";
import { Money } from "../common/Money";
import { Multiplier } from "../common/Multiplier";
import { Period } from "../common/Period";
import { PriceConfiguration } from "./PriceConfiguration";
// export type CreateUnit = 
type _Type = Omit<PriceConfiguration, 'availableTo' | 'status' | 'validFor'>
    & Partial<Pick<PriceConfiguration, 'validFor'>>
    & Record<keyof Pick<PriceConfiguration, 'availableTo'>, string[]>
export class CreatePriceConfiguration implements _Type {

    @ValidateNested({ each: true })
    price!: Money[];

    @IsEnum(Multiplier, { each: true })
    type!: Multiplier[];
    validFor?: Period;

    @IsOptional()
    @IsInt()
    @Min(1)
    public maxNumPeople?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    public minNumPeople?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    public maxNumNights?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    public minNumNights?: number;

    @IsUUID("5", { each: true })
    public availableTo!: string[]
}
