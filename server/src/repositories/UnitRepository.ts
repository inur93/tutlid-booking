import { Types } from "mongoose";
import Model, { UnitDoc } from "../models/unit/Unit";
import { BaseRepository, IBaseRepository } from "./BaseRepository";



export interface IUnitRepository extends IBaseRepository<UnitDoc> {
    getWithPriceConfig(id: Types.ObjectId): Promise<UnitDoc>
    getAllWithPriceConfig(): Promise<UnitDoc[]>
}

export default class UnitRepository extends BaseRepository<UnitDoc> implements IUnitRepository {

    constructor() {
        super(Model);
    }
    async getAllWithPriceConfig(): Promise<UnitDoc[]> {
        return await this.model.find()
            .populate({
                path: 'priceConfiguration',
                populate: 'availableTo'
            })
    }

    async getWithPriceConfig(id: Types.ObjectId): Promise<UnitDoc> {
        const res = await this.model.findById(id)
            .populate({
                path: 'priceConfiguration',
                populate: 'availableTo'
            })
        if (!res) throw new Error(`PriceConfig with id ${id} does not exist`);
        return res;
    }


}
