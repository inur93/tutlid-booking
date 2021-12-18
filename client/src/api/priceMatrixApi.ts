import { CreateBooking } from ".";
import { formatQueryDate } from "../utils/dateFunctions";
import { BaseApi } from "./baseApi";

export class PriceMatrixApi extends BaseApi {

    constructor() {
        super();
        this.secured = true;
    }

    async getAll(from?: Date) {
        return await super.get(`/pricematrix/?validFrom=${from ? formatQueryDate(from) : ''}`);
    }

    async calculatePrice(booking: CreateBooking) {
        return await super.post('/pricematrix/calculateprice', booking);
    }
}