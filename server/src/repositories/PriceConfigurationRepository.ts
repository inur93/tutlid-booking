import Model, { PriceConfigurationDoc } from "../models/priceConfiguration/PriceConfiguration";
import { BaseRepository, IBaseRepository } from "./BaseRepository";


export interface IPriceConfigurationRepository extends IBaseRepository<PriceConfigurationDoc> { }
export class PriceConfigurationRepository extends BaseRepository<PriceConfigurationDoc> implements IPriceConfigurationRepository {
    constructor() {
        super(Model);
    }
}
