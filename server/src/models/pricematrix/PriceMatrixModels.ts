import { Document, Model, model, models, Schema, Types } from "mongoose";

export interface PriceMatrix {
    _id: Types.ObjectId,
    validFrom: Date;
    validTo?: Date;
    price: number;
    tubPrice: number;
}
export type CreatePriceMatrix = Pick<PriceMatrix, 'validFrom' | 'tubPrice' | 'price'>
export type UpdatePriceMatrix = Partial<PriceMatrix>
export type QueryPriceMatrix = Partial<Pick<PriceMatrix, 'validFrom' | 'validTo' | '_id'>>
const PriceMatrixSchemaFields: Record<keyof Omit<PriceMatrix, '_id'>, any> = {
    validFrom: {
        type: Date,
        required: true
    },
    validTo: Date,
    price: {
        type: Number,
        required: true
    },
    tubPrice: {
        type: Number,
        required: true
    }
}

const PriceMatrixSchema = new Schema(PriceMatrixSchemaFields);
export interface PriceMatrixDoc extends Omit<PriceMatrix, '_id'>, Document { }
export const PriceMatrixModel: Model<PriceMatrixDoc> = models.PriceMatrix || model<PriceMatrixDoc>('PriceMatrix', PriceMatrixSchema);
