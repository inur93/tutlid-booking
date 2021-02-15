import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

class BankInformation extends Base {

    @prop({ required: true })
    public regNo!: string;

    @prop({ required: true })
    public accountNo!: string;


}

const BankInformationModel = getModelForClass(BankInformation);
export {
    BankInformation, BankInformationModel
};

