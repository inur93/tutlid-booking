import { Types } from 'mongoose';
import { IContainer } from '../container';
import { UpdateBankInformation } from '../models/bankinformation/bankinformation.dto';
import { BankInformation } from '../models/bankinformation/bankinformation.entity';
import { IBankInformationRepository } from '../repositories/bankinformation.repo';

export interface IBankInformationController {
    current(): Promise<BankInformation>
    update(id: Types.ObjectId, update: BankInformation): Promise<BankInformation>
}
class BankInformationController implements IBankInformationController {

    bankInformationRepository: IBankInformationRepository;
    constructor({ bankInformationRepository }: IContainer) {
        this.bankInformationRepository = bankInformationRepository;
    }

    public async current(): Promise<BankInformation> {
        return this.bankInformationRepository.current()
    }

    public async update(id: Types.ObjectId, update: UpdateBankInformation): Promise<BankInformation> {
        return this.bankInformationRepository.update({
            _id: id,
            ...update
        })
    }
}

export default BankInformationController;
