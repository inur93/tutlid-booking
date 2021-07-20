import { PriceConfiguration } from "./PriceConfiguration";
import { Group } from "../group/Group";
import { GetAdminGroup } from "../group/GetAdminGroup";

export type GetAdminPriceConfiguration = Omit<PriceConfiguration, 'availableTo'>
    & Record<keyof Pick<PriceConfiguration, 'availableTo'>, GetAdminGroup[]>;