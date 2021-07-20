import { Document, Model, model, models, Schema, Types } from 'mongoose';
import { ItemStatus } from '../common/ItemStatus';
import { Period, PeriodSchema } from '../common/Period';
import { Translation, TranslationSchema } from '../common/Translation';
import { PriceConfiguration } from '../priceConfiguration/PriceConfiguration';
import { UnitType } from './UnitType';


export interface Unit {
    _id: Types.ObjectId,
    name: Translation[],
    description?: Translation[],
    type: UnitType,
    status: ItemStatus,
    priceConfiguration: Types.ObjectId[] | PriceConfiguration[],
    addOnOptions: Types.ObjectId[] | Unit[],
    unavailable: Period[]
}

const UnitSchemaFields: Record<keyof Omit<Unit, '_id'>, any> = {
    name: {
        type: [TranslationSchema],
        required: true
    },
    description: {
        type: [TranslationSchema],
        required: true
    },
    type: {
        type: String,
        enum: UnitType,
        default: UnitType.Simple,
        required: true
    },
    status: {
        type: String,
        enum: ItemStatus,
        default: ItemStatus.Draft
    },
    addOnOptions: {
        type: [Schema.Types.ObjectId],
        ref: 'Unit'
    },
    priceConfiguration: {
        type: [Schema.Types.ObjectId],
        ref: 'PriceConfiguration'
    },
    unavailable: [PeriodSchema]
}

export interface UnitDoc extends Omit<Unit, '_id'>, Document { }
export interface UnitModel extends Model<UnitDoc> { };
const UnitSchema = new Schema<UnitDoc, UnitModel>(UnitSchemaFields);

export default models.Unit || model<UnitDoc>('Unit', UnitSchema);