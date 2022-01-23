import { Types } from 'mongoose';
import { BankInformationDoc, BankInformationModel, UpdateBankInformation } from "../models/bankinformation/BankInformationModels";


export interface IBankInformationRepository {
    current(): Promise<BankInformationDoc | null>
    update(_id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformationDoc>
}

export default class BankInformationRepository implements IBankInformationRepository {
    async current(): Promise<BankInformationDoc | null> {
        return BankInformationModel.findOne({});
    }
    async update(_id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformationDoc> {
        await BankInformationModel.updateOne({ _id }, update);
        const updated = await BankInformationModel.findById(_id);
        if (!updated) {
            throw new Error(`could not update booking. ${_id} was not found`);
        }
        return updated;
    }
}
