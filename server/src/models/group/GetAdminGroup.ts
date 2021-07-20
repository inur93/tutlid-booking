import { Types } from "mongoose";
import { Group } from "./Group";

export type GetAdminGroup = Pick<Group, '_id' | 'name'>
    & Record<keyof Pick<Group, 'users'>, Types.ObjectId[]>
    