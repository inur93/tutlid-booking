import { PriceConfiguration } from "./PriceConfiguration";
import { GetMoney } from "../common/GetMoney";

export type GetPriceConfiguration = Pick<PriceConfiguration, 'type'>
& Record<keyof Pick<PriceConfiguration, 'price'>, GetMoney>