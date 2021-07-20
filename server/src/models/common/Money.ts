import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Schema } from "mongoose";

export class Money {
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount!: number;

    @IsString()
    currency!: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean
}

const MoneySchemaFields: Record<keyof Money, any> = {
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    isDefault: Boolean
}

export const MoneySchema = new Schema(MoneySchemaFields);