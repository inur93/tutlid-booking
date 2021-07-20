import { Document, Model, model, models, Schema, Types } from 'mongoose';
import { ItemStatus } from '../common/ItemStatus';
import { Money, MoneySchema } from '../common/Money';
import { Multiplier } from '../common/Multiplier';
import { Period, PeriodSchema } from '../common/Period';
import { Group } from '../group/Group';

export interface PriceConfiguration {
    price: Money[],
    type: Multiplier[],
    status: ItemStatus,
    validFor?: Period,

    maxNumPeople?: number,
    minNumPeople?: number,
    maxNumNights?: number,
    minNumNights?: number,

    availableTo: Types.ObjectId[] | Group[]

}

const PriceConfigurationSchemaFields: Record<keyof PriceConfiguration, any> = {
    price: {
        type: [MoneySchema],
        required: true
    },
    type: {
        type: String,
        enum: Multiplier,
        required: true
    },
    status: {
        type: String,
        enum: ItemStatus,
        required: true,
        default: ItemStatus.Draft
    },
    validFor: PeriodSchema,
    maxNumNights: { type: Number },
    minNumNights: { type: Number },
    maxNumPeople: { type: Number },
    minNumPeople: { type: Number },

    availableTo: {
        type: [Schema.Types.ObjectId],
        ref: 'Group'
    }
}
export interface PriceConfigurationDoc extends Omit<PriceConfiguration, '_id'>, Document { }
export interface PriceConfigurationModel extends Model<PriceConfigurationDoc> { };
export const PriceConfigurationSchema = new Schema<PriceConfigurationDoc, PriceConfigurationModel>(PriceConfigurationSchemaFields);
export default models.PriceConfiguration || model<PriceConfigurationDoc>('PriceConfiguration', PriceConfigurationSchema);