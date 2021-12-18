import { Operation } from "fast-json-patch";
import { FilterQuery, Types } from "mongoose";
import { IContainer } from "../container";
import { CreateGroup } from "../models/group/CreateGroup";
import { GetAdminGroupWithNames } from "../models/group/GetAdminGroupWithNames";
import { Group } from "../models/group/Group";
import { IGroupRepository } from "../repositories/GroupRepository";
import Mapper from "../utils/Mapper";


export interface IGroupController {
    adminGet(id: Types.ObjectId): Promise<GetAdminGroupWithNames>
    create(Group: CreateGroup): Promise<GetAdminGroupWithNames>
    delete(id: Types.ObjectId): Promise<void>
    patch(id: Types.ObjectId, ops: Operation[]): Promise<GetAdminGroupWithNames>
    adminSearch(query: FilterQuery<Group>): Promise<GetAdminGroupWithNames[]>
}

export class GroupController implements IGroupController {

    private repo: IGroupRepository;
    constructor({ groupRepository }: IContainer) {
        this.repo = groupRepository;
    }

    async adminGet(id: Types.ObjectId): Promise<GetAdminGroupWithNames> {
        const group = await this.repo.findById(id);
        return Mapper.toGetAdminGroupWithNames(group);
    }


    async create(group: CreateGroup): Promise<GetAdminGroupWithNames> {
        const created = await this.repo.create(group);
        return Mapper.toGetAdminGroupWithNames(created);
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await this.repo.delete(id);
    }
    async patch(id: Types.ObjectId, ops: Operation[]): Promise<GetAdminGroupWithNames> {
        const updated = await this.repo.patch(id, ops);
        return Mapper.toGetAdminGroupWithNames(updated);
    }

    async adminSearch(query: FilterQuery<Group>): Promise<GetAdminGroupWithNames[]> {
        const results = await this.repo.find(query);
        return results.map(Mapper.toGetAdminGroupWithNames);
    }

}
