import { Types } from 'mongoose';
import Model, { BankInformationDoc, UpdateBankInformation } from "../models/bankinformation/BankInformation";


export interface IBankInformationRepository {
    current(): Promise<BankInformationDoc | null>
    update(_id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformationDoc>
}

export default class BankInformationRepository implements IBankInformationRepository {
    async current(): Promise<BankInformationDoc | null> {
        return await Model.findOne({});
    }
    async update(_id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformationDoc> {
        await Model.updateOne({ _id }, update);
        const rec = await Model.findById(_id);
        if (!rec) throw new Error(`BankInformation with id ${_id} does not exist`);
        return rec;
    }
}
