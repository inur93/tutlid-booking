import { Types } from "mongoose";
import { CreatePriceMatrix, PriceMatrix, PriceMatrixModel, QueryPriceMatrix } from "../models/pricematrix/PriceMatrixModels";


export interface IPriceMatrixRepository {
    create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrix>
    getLatest(): Promise<PriceMatrix>
    findValidPriceMatrix(date: Date): Promise<PriceMatrix>
    find(from?: Date): Promise<PriceMatrix[]>
    findOne(query: QueryPriceMatrix): Promise<PriceMatrix>
    updateValidTo(_id: Types.ObjectId, validTo?: Date): Promise<PriceMatrix>
    delete(_id: Types.ObjectId): Promise<void>
}

export default class PriceMatrixRepository implements IPriceMatrixRepository {

    async create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrix> {
        const created = await PriceMatrixModel.create(priceMatrix);
        return PriceMatrixModel.findById(created._id);
    }
    async updateValidTo(_id: Types.ObjectId, validTo?: Date): Promise<PriceMatrix> {
        return PriceMatrixModel.findOneAndUpdate({
            _id
        }, { validTo });
    }

    async getLatest(): Promise<PriceMatrix> {
        return PriceMatrixModel.findOne({
            validTo: undefined
        })
    }
    async findValidPriceMatrix(date: Date): Promise<PriceMatrix> {
        return PriceMatrixModel.findOne({
            validFrom: { $lte: date },
            $or: [
                { validTo: { $exists: false } },
                { validTo: undefined },
                { validTo: { $gte: date } }
            ]
        }).exec()
    }
    async find(from?: Date): Promise<PriceMatrix[]> {
        if (from) {
            return PriceMatrixModel.find({
                $or: [
                    { validTo: { $exists: false } },
                    { validTo: undefined },
                    { validTo: { $gte: from } }
                ]
            })
                .sort({ validFrom: 1 })
                .exec();
        } else {
            return PriceMatrixModel.find()
                .sort({ validFrom: 1 })
                .exec();
        }
    }

    async findOne(query: QueryPriceMatrix): Promise<PriceMatrix> {
        if (query._id) return PriceMatrixModel.findById(query._id);
        return PriceMatrixModel.findOne(query).exec();
    }

    async delete(_id: Types.ObjectId): Promise<void> {
        await PriceMatrixModel.deleteOne({ _id }).exec();
    }
}
