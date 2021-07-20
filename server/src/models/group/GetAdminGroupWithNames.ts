import { GetAdminUser } from "../user/GetAdminUser";
import { GetAdminGroup } from "./GetAdminGroup";
import { Group } from "./Group";

export type GetAdminGroupWithNames = Omit<GetAdminGroup, 'users'>
    & Record<keyof Pick<Group, 'users'>, GetAdminUser[]>