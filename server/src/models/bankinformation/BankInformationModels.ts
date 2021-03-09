import { model, Schema, Document, Types, models, Model } from "mongoose";



export interface BankInformation {
    _id: Types.ObjectId,
    regNo: string;
    accountNo: string;
}
export type UpdateBankInformation = Partial<BankInformation>

const BankInformationSchemaFields: Record<keyof Omit<BankInformation, '_id'>, any> = {
    accountNo: {
        type: String,
        required: true
    },
    regNo: {
        type: String,
        required: true
    }
}

const BankInformationSchema = new Schema(BankInformationSchemaFields)
export interface BankInformationDoc extends Omit<BankInformation, '_id'>, Document { }
export const BankInformationModel: Model<BankInformationDoc> = models.BankInformation || model<BankInformationDoc>('BankInformation', BankInformationSchema);
