import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

class PriceMatrix extends Base {
    @prop({ required: true })
    public validFrom!: Date;

    @prop()
    public validTo?: Date;

    @prop({ required: true })
    price!: number;

    @prop({ required: true })
    tubPrice!: number;

}

const PriceMatrixModel = getModelForClass(PriceMatrix);
export {
    PriceMatrixModel, PriceMatrix
};

