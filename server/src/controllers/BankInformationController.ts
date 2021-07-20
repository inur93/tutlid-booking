import { Types } from 'mongoose';
import { IContainer } from '../container';
import { UpdateBankInformation } from '../models/bankinformation/UpdateBankInformation';
import { BankInformation } from '../models/bankinformation/BankInformation';
import { IBankInformationRepository } from '../repositories/BankInformationRepository';

export interface IBankInformationController {
    current(): Promise<BankInformation | null>
    update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation>
}
class BankInformationController implements IBankInformationController {

    bankInformationRepository: IBankInformationRepository;
    constructor({ bankInformationRepository }: IContainer) {
        this.bankInformationRepository = bankInformationRepository;
    }

    public async current(): Promise<BankInformation | null> {
        return await this.bankInformationRepository.current();
    }

    public async update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation> {
        return this.bankInformationRepository.update(id, update);
    }
}

export default BankInformationController;
