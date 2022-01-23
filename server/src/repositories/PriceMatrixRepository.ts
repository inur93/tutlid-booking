import { Types } from "mongoose";
import { CreatePriceMatrix, PriceMatrix, PriceMatrixDoc, PriceMatrixModel, QueryPriceMatrix } from "../models/pricematrix/PriceMatrixModels";


export interface IPriceMatrixRepository {
    create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrixDoc>
    getLatest(): Promise<PriceMatrixDoc | null>
    findValidPriceMatrix(date: Date): Promise<PriceMatrixDoc | null>
    find(from?: Date): Promise<PriceMatrixDoc[]>
    findOne(query: QueryPriceMatrix): Promise<PriceMatrixDoc | null>
    updateValidTo(_id: Types.ObjectId, validTo?: Date): Promise<PriceMatrixDoc | null>
    delete(_id: Types.ObjectId): Promise<void>
}

export default class PriceMatrixRepository implements IPriceMatrixRepository {

    async create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrixDoc> {
        return await PriceMatrixModel.create(priceMatrix);
    }
    async updateValidTo(_id: Types.ObjectId, validTo?: Date): Promise<PriceMatrixDoc | null> {
        return PriceMatrixModel.findOneAndUpdate({
            _id
        }, { validTo });
    }

    async getLatest(): Promise<PriceMatrixDoc | null> {
        return PriceMatrixModel.findOne({
            validTo: undefined
        })
    }
    async findValidPriceMatrix(date: Date): Promise<PriceMatrixDoc | null> {
        return PriceMatrixModel.findOne({
            validFrom: { $lte: date },
            $or: [
                { validTo: { $exists: false } },
                { validTo: undefined },
                { validTo: { $gte: date } }
            ]
        }).exec()
    }
    async find(from?: Date): Promise<PriceMatrixDoc[]> {
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

    async findOne(query: QueryPriceMatrix): Promise<PriceMatrixDoc | null> {
        if (query._id) return PriceMatrixModel.findById(query._id);
        return PriceMatrixModel.findOne(query).exec();
    }

    async delete(_id: Types.ObjectId): Promise<void> {
        await PriceMatrixModel.deleteOne({ _id }).exec();
    }
}
