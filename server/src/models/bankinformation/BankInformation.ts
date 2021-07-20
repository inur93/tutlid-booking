import { model, Schema, Document, Types, Model, models } from "mongoose";



export interface BankInformation {
    _id?: Types.ObjectId,
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

export interface BankInformationDoc extends Omit<BankInformation, '_id'>, Document { }
export interface BankInformationModel extends Model<BankInformationDoc> { }
const BankInformationSchema = new Schema<BankInformationDoc, BankInformationModel>(BankInformationSchemaFields)

export default models.BankInformation || model<BankInformationDoc>('BankInformation', BankInformationSchema);


