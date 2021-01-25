import { DocumentType, getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Model } from 'mongoose';


class BankInformation extends Base {

    @prop({ required: true })
    public regNo: string;

    @prop({ required: true })
    public accountNo: string;


}

const BankInformationModel = getModelForClass(BankInformation) as Model<DocumentType<BankInformation>>;
export {
    BankInformation, BankInformationModel
};
