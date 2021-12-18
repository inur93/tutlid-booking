import { Operation } from "fast-json-patch";
import { FilterQuery, Types } from "mongoose";
import { IContainer } from "../container";
import { ItemStatus } from "../models/common/ItemStatus";
import { CreatePriceConfiguration } from "../models/priceConfiguration/CreatePriceConfiguration";
import { CreateUnit } from "../models/unit/CreateUnit";
import { Unit } from "../models/unit/Unit";
import { GetAdminUnit } from "../models/unit/GetAdminUnit";
import { SearchUnit } from "../models/unit/SearchUnit";
import { IPriceConfigurationRepository } from "../repositories/PriceConfigurationRepository";
import { IUnitRepository } from "../repositories/UnitRepository";
import Mapper from "../utils/Mapper";


export interface IUnitController {
    adminGet(id: Types.ObjectId): Promise<GetAdminUnit>
    create(unit: CreateUnit): Promise<GetAdminUnit>
    addPriceConfiguration(id: Types.ObjectId, priceConfiguration: CreatePriceConfiguration): Promise<GetAdminUnit>
    delete(id: Types.ObjectId): Promise<void>
    patch(id: Types.ObjectId, ops: Operation[]): Promise<GetAdminUnit>
    search(query: FilterQuery<Unit>, language: string): Promise<SearchUnit[]>
    adminSearch(query: FilterQuery<Unit>): Promise<GetAdminUnit[]>
}

export class UnitController implements IUnitController {

    private repo: IUnitRepository;
    private priceConfigRepo: IPriceConfigurationRepository;
    constructor({ unitRepository, priceConfigurationRepository }: IContainer) {
        this.repo = unitRepository;
        this.priceConfigRepo = priceConfigurationRepository;
    }

    async adminGet(id: Types.ObjectId): Promise<GetAdminUnit> {
        const unit = await this.repo.getWithPriceConfig(id);

        return Mapper.toGetAdminUnit(unit);
    }


    async create(unit: CreateUnit): Promise<GetAdminUnit> {
        const created = await this.repo.create({
            ...unit,
            priceConfiguration: [],
            addOnOptions: [],
            status: ItemStatus.Draft
        });
        return Mapper.toGetAdminUnit(created);
    }
    async addPriceConfiguration(id: Types.ObjectId, priceConfiguration: CreatePriceConfiguration): Promise<GetAdminUnit> {
        const unit = await this.repo.findById(id);
        const created = await this.priceConfigRepo.create({
            ...priceConfiguration,
            status: ItemStatus.Draft,
            availableTo: priceConfiguration.availableTo.map(Types.ObjectId)
        })
        unit.priceConfiguration.push(created._id);
        unit.save();
        return Mapper.toGetAdminUnit(await this.repo.getWithPriceConfig(id));
    }
    async delete(id: Types.ObjectId): Promise<void> {
        await this.repo.delete(id);
    }
    async patch(id: Types.ObjectId, ops: Operation[]): Promise<GetAdminUnit> {
        const updated = await this.repo.patch(id, ops);
        return Mapper.toGetAdminUnit(updated);
    }
    async search(query: FilterQuery<Unit>, language: string): Promise<SearchUnit[]> {
        query.status = ItemStatus.Published;
        const results = await this.repo.find(query);

        return results.map(x => Mapper.toSearchUnit(x, language));
    }

    async adminSearch(query: FilterQuery<Unit>): Promise<GetAdminUnit[]> {
        const results = await this.repo.find(query);
        return results.map(Mapper.toGetAdminUnit);
    }

}