import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { BankInformation, BankInformationModel } from '../models/bankinformation/bankinformation.entity';

class BankInformationController {

    public async current(): Promise<DocumentType<BankInformation>> {
        return await BankInformationModel.findOne({})
            .exec();
    }

    public async update(id: Types.ObjectId, update: BankInformation): Promise<DocumentType<BankInformation>> {
        return await BankInformationModel.findByIdAndUpdate(id, update).exec();
    }

    public async create(bankInfo: BankInformation): Promise<DocumentType<BankInformation>> {
        return await BankInformationModel.create({
            ...bankInfo
        });
    }
}

export default BankInformationController;