import { Types } from 'mongoose';
import { BankInformation, BankInformationModel, UpdateBankInformation } from "../models/bankinformation/BankInformationModels";


export interface IBankInformationRepository {
    current(): Promise<BankInformation>
    update(_id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation>
}

export default class BankInformationRepository implements IBankInformationRepository {
    async current(): Promise<BankInformation> {
        return BankInformationModel.findOne({});
    }
    async update(_id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation> {
        await BankInformationModel.updateOne({ _id }, update);
        return BankInformationModel.findById(_id);
    }
}
