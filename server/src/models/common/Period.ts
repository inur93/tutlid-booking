import { IsDateString } from "class-validator";
import { Schema } from "mongoose"

export class Period {
    from?: Date
    to?: Date
}

const PeriodSchemaFields: Record<keyof Period, any> = {
    from: Date,
    to: Date
}

export const PeriodSchema = new Schema(PeriodSchemaFields);