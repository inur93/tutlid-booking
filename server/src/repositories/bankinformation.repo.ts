import { Types } from 'mongoose';
import { BankInformation, BankInformationModel } from "../models/bankinformation/bankinformation.entity";

type UpdateBankInformation = {
    _id: Types.ObjectId
    regNo?: string
    accountNo?: string
}

export interface IBankInformationRepository {
    current(): Promise<BankInformation>
    update({ _id, ...update }: UpdateBankInformation): Promise<BankInformation>
}

export default class BankInformationRepository implements IBankInformationRepository {
    async current(): Promise<BankInformation> {
        return BankInformationModel.findOne({});
    }
    async update({ _id, ...update }: UpdateBankInformation): Promise<BankInformation> {
        await BankInformationModel.updateOne({ _id }, update);
        return BankInformationModel.findById(_id);
    }
}
