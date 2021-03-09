import { Types } from 'mongoose';
import { IContainer } from '../container';
import { UpdateBankInformation } from '../models/bankinformation/BankInformationViewModels';
import { BankInformation } from '../models/bankinformation/BankInformationModels';
import { IBankInformationRepository } from '../repositories/BankInformationRepository';

export interface IBankInformationController {
    current(): Promise<BankInformation>
    update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation>
}
class BankInformationController implements IBankInformationController {

    bankInformationRepository: IBankInformationRepository;
    constructor({ bankInformationRepository }: IContainer) {
        this.bankInformationRepository = bankInformationRepository;
    }

    public async current(): Promise<BankInformation> {
        return this.bankInformationRepository.current();
    }

    public async update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation> {
        return this.bankInformationRepository.update(id, update);
    }
}

export default BankInformationController;
