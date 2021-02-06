import { Types } from "mongoose";
import { PriceMatrix, PriceMatrixModel } from "../models/pricematrix/pricematrix.entity";
import { BaseRepository, IBaseRepository } from "./base.repo";

type CreatePriceMatrix = {
    validFrom: Date,
    tubPrice: number,
    price: number
}

type UpdatePriceMatrix = {
    _id: Types.ObjectId,
    validTo?: Date,
    price?: number,
    tubPrice?: number,
    validFrom?: number
}

export interface IPriceMatrixRepository extends IBaseRepository<PriceMatrix, CreatePriceMatrix, UpdatePriceMatrix> {

    getLatest(): Promise<PriceMatrix>
    getByDate(date: Date): Promise<PriceMatrix>
    find(from?: Date): Promise<PriceMatrix[]>
    updateValidToByDate(queryDate: Date, validTo?: Date): Promise<PriceMatrix>
}

export default class PriceMatrixRepository extends BaseRepository<PriceMatrix, CreatePriceMatrix, UpdatePriceMatrix> implements IPriceMatrixRepository {

    constructor() {
        super(PriceMatrixModel);
    }

    async updateValidToByDate(queryDate: Date, validTo?: Date): Promise<PriceMatrix> {
        const update: any = validTo ?
            { validTo } :
            { $unset: { validTo: true } };
        return PriceMatrixModel.findOneAndUpdate({
            validTo: queryDate
        }, update);
    }

    async getLatest(): Promise<PriceMatrix> {
        return PriceMatrixModel.findOne({
            validTo: { $exists: false }
        })
    }
    async getByDate(date: Date): Promise<PriceMatrix> {
        return PriceMatrixModel.findOne({
            validFrom: { $lte: date },
            $or: [
                { validTo: { $exists: false } },
                { validTo: { $gte: date } }
            ]
        }).exec()
    }
    async find(from?: Date): Promise<PriceMatrix[]> {
        if (from) {
            return PriceMatrixModel.find({ validFrom: { $gte: from } })
                .sort({ validFrom: 1 })
                .exec();
        } else {
            return PriceMatrixModel.find()
                .sort({ validFrom: 1 })
                .exec();
        }
    }
}
