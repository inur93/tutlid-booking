import { Types } from 'mongoose';
import { IContainer } from '../container';
import { UpdateBankInformation } from '../models/bankinformation/BankInformationViewModels';
import { BankInformation, BankInformationDoc } from '../models/bankinformation/BankInformationModels';
import { IBankInformationRepository } from '../repositories/BankInformationRepository';

export interface IBankInformationController {
    current(): Promise<BankInformationDoc | null>
    update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformationDoc>
}
class BankInformationController implements IBankInformationController {

    bankInformationRepository: IBankInformationRepository;
    constructor({ bankInformationRepository }: IContainer) {
        this.bankInformationRepository = bankInformationRepository;
    }

    public async current(): Promise<BankInformationDoc | null> {
        return this.bankInformationRepository.current();
    }

    public async update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformationDoc> {
        return this.bankInformationRepository.update(id, update);
    }
}

export default BankInformationController;
