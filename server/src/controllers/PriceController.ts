import { differenceInDays } from "date-fns";
import { Types } from "mongoose";
import { IContainer } from "../container";
import { BookingItemWithPrice } from "../models/booking/BookingItemWithPrice";
import { BookingWithPrice } from "../models/booking/BookingWithPrice";
import { CreateBooking } from "../models/booking/CreateBooking";
import { CreateBookingItem } from "../models/booking/CreateBookingItem";
import { ItemStatus } from "../models/common/ItemStatus";
import { Multiplier } from "../models/common/Multiplier";
import { PriceConfiguration } from "../models/priceConfiguration/PriceConfiguration";
import { UnitDoc } from "../models/unit/Unit";
import { User } from "../models/user/User";
import { IUnitRepository } from "../repositories/UnitRepository";


export interface IPriceController {
    applyPrice(booking: CreateBooking, user: User): Promise<BookingWithPrice>
}
type PriceConfig = Pick<PriceConfiguration, 'maxNumNights' | 'maxNumPeople' | 'minNumNights' | 'minNumPeople' | 'type'>
    & Record<keyof Pick<PriceConfiguration, 'price'>, number>
    & { unit: Types.ObjectId }
export class PriceController implements IPriceController {

    private readonly unitRepository: IUnitRepository;
    constructor({ unitRepository }: IContainer) {
        this.unitRepository = unitRepository;
    }
    async applyPrice(booking: CreateBooking, user: User): Promise<BookingWithPrice> {
        const units = await this.unitRepository.getAllWithPriceConfig();
        const priceConfigs = this.getPriceConfigurationsForUser(units, booking.currency, booking.from, user);
        const itemsWithPrice = booking.items.map(item => this.applyBookingItemPrice(item, booking, priceConfigs.find(x => x.unit)));
        return {
            ...booking,
            items: itemsWithPrice,
            totalAmount: itemsWithPrice.reduce((sum, item) => sum + item.totalPrice, 0)
        }
    }

    applyBookingItemPrice(item: CreateBookingItem, booking: CreateBooking, priceConfig?: PriceConfig): BookingItemWithPrice {
        let days = this.getNumberOfDays(booking, priceConfig);
        let guests = this.getNumberOfGuests(booking, priceConfig);

        let multipliers = 1;
        if (priceConfig?.type.includes(Multiplier.PerNight)) {
            multipliers *= days;
        }
        if (priceConfig?.type.includes(Multiplier.PerPerson)) {
            multipliers *= guests;
        }
        if (priceConfig?.type.includes(Multiplier.FixedPrice)) {
            multipliers = 1; //corresponding to unit price which also overrides any additional multipliers
        }

        const unitPrice = priceConfig?.price || 150;
        let totalPrice = unitPrice * multipliers;
        return {
            ...item,
            unitPrice,
            totalPrice,
            discount: 0
        }
    }

    getNumberOfGuests(booking: CreateBooking, priceConfig?: PriceConfig): number {
        let guests = booking.guests;

        if (priceConfig?.maxNumPeople && guests > priceConfig.maxNumPeople) {
            guests = priceConfig.maxNumPeople;
        }
        if (priceConfig?.minNumPeople && guests < priceConfig.minNumPeople) {
            guests = priceConfig.minNumPeople;
        }
        return guests;
    }

    getNumberOfDays(booking: CreateBooking, priceConfig?: PriceConfig): number {
        let days = differenceInDays(booking.to, booking.from);

        if (priceConfig?.maxNumNights && days > priceConfig.maxNumNights) {
            days = priceConfig.maxNumNights;
        }
        if (priceConfig?.minNumNights && days < priceConfig.minNumNights) {
            days = priceConfig.minNumNights;
        }
        return days;
    }

    getPriceConfigurationsForUser(units: UnitDoc[], currency: string, date: Date, user: User): PriceConfig[] {
        return units.map(unit => {
            const config = (unit.priceConfiguration as PriceConfiguration[])
                //take only published price configurations    
                .filter(x => x.status === ItemStatus.Published)
                //take only those that are valid for the first date of the booking
                .filter(x => !x.validFor
                    || ((!x.validFor.from || x.validFor.from <= date)
                        && (!x.validFor.to || x.validFor.to >= date)))
                // find which apply to this user
                .filter(x => !x.availableTo || (x.availableTo as Types.ObjectId[]).includes(user._id!))
                //find price with the correct currency
                .map(x => ({
                    ...x,
                    //default price is 200
                    price: x.price.find(price => price.currency === currency)?.amount || 150
                }))
                //order by lowest price first
                .sort((a, b) => a.price - b.price)
                //take the first element in the list
                .find(x => true);

            return {
                type: config?.type || [Multiplier.PerNight],
                unit: Types.ObjectId(unit._id),
                price: config?.price || 150,
                maxNumNights: config?.maxNumNights,
                minNumNights: config?.minNumNights,
                maxNumPeople: config?.maxNumPeople,
                minNumPeople: config?.minNumPeople,
            }
        })

    }

}