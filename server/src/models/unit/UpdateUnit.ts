import { AddOperation, Operation, RemoveOperation, ReplaceOperation } from "fast-json-patch";
import { ItemStatus } from "../common/ItemStatus";
import { Period } from "../common/Period";
import { Translation } from "../common/Translation";
import { PriceConfiguration } from "../priceConfiguration/PriceConfiguration";
import { UnitType } from "./UnitType";

export type UpdateUnit = (AddOperation<Translation> |
    AddOperation<PriceConfiguration> |
    AddOperation<Period> |
    AddOperation<string> |
    RemoveOperation |
    ReplaceOperation<UnitType> |
    ReplaceOperation<ItemStatus> |
    ReplaceOperation<Number> |
    Operation // could also be only this
)[]

