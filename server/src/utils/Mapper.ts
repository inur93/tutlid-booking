import { Unit, UnitDoc } from "../models/unit/Unit";
import { User, UserDoc } from "../models/user/User";
import { GetAdminPriceConfiguration } from "../models/priceConfiguration/GetAdminPriceConfiguration";
import { GetAdminAddOn, GetAdminUnit } from "../models/unit/GetAdminUnit";
import { GetSelf } from "../models/user/GetSelf";
import { SearchUnit } from "../models/unit/SearchUnit";
import { PriceConfigurationDoc } from "../models/priceConfiguration/PriceConfiguration";
import { GroupDoc } from "../models/group/Group";
import { GetAdminGroup } from "../models/group/GetAdminGroup";
import { Types } from "mongoose";
import { GetAdminUser } from "../models/user/GetAdminUser";
import { Translation } from "../models/common/Translation";
import { BookingDoc } from "../models/booking/Booking";
import { GetAnonymousBooking } from "../models/booking/GetAnonymousBooking";
import { GetBooking } from "../models/booking/GetBooking";
import { GetAdminGroupWithNames } from "../models/group/GetAdminGroupWithNames";


export default class Mapper {
    static toGetAnonymousBooking({ _id, from, to }: BookingDoc): GetAnonymousBooking {
        return { _id, from, to }
    }
    static toGetBooking({ _id, from, to, status, paidAmount, bookedBy, items, guests, currency }: BookingDoc): GetBooking {
        return {
            _id, from, to, status, guests, currency,
            bookedBy: bookedBy as User,
            items
        }
    }
    static translate(translation: Translation[] | undefined, language: string): string {
        if (!translation) return '';
        return (translation.find(x => x.language === language)
            || translation.find(x => true))?.content || ''
    }
    static toSearchUnit({ _id, addOnOptions, name, isAddon, unavailable, description }: UnitDoc | Unit, language: string): SearchUnit {
        return {
            _id, isAddon, unavailable,
            addOnOptions: addOnOptions.map(x => this.toSearchUnit(x as Unit, language)),
            description: this.translate(description, language),
            name: this.translate(name, language)
        }
    }
    static toGetAdminUnit({ _id, addOnOptions, priceConfiguration, status, name, isAddon, unavailable, description }: UnitDoc): GetAdminUnit {
        return {
            _id, status, name, isAddon, unavailable, description,
            priceConfiguration: priceConfiguration as GetAdminPriceConfiguration[],
            addOnOptions: addOnOptions as GetAdminAddOn[]
        };
    }

    static toGetAdminPriceConfiguration({ type, availableTo, status, price }: PriceConfigurationDoc): GetAdminPriceConfiguration {
        return {
            type,
            availableTo: (availableTo as GroupDoc[]).map(this.toGetAdminGroup),
            price,
            status
        }
    }

    static toGetAdminGroup({ _id, users, name }: GroupDoc): GetAdminGroup {
        return {
            _id,
            name,
            users: (users || []).map((x: Types.ObjectId | User) => x as Types.ObjectId)
        }
    }

    static toGetAdminGroupWithNames({ _id, users, name }: GroupDoc): GetAdminGroupWithNames {
        return {
            _id,
            name,
            users: (users || []).map((x: Types.ObjectId | User) => x as User)
        }
    }

    static toGetAdminUser({ _id, fullName, status, email, deleted, roles }: UserDoc): GetAdminUser {
        return { _id, fullName, status, email, deleted, roles }
    }

    static toGetSelf({ _id, fullName, email }: UserDoc): GetSelf {
        return { _id, fullName, email }
    }
}