import { Types } from "mongoose";
import { GroupDoc, GroupModel } from "../models/group/Group";
import { BaseRepository, IBaseRepository } from "./BaseRepository";



export interface IGroupRepository extends IBaseRepository<GroupDoc> {
    addUser(id: Types.ObjectId): Promise<GroupDoc>
}

export default class GroupRepository extends BaseRepository<GroupDoc> implements IGroupRepository {

    constructor() {
        super(GroupModel);
    }
    async addUser(id: Types.ObjectId): Promise<GroupDoc> {
        this.model.updateOne({ _id: id }, {
            $addToSet: { users: id }
        })
        return this.findById(id);
    }


}
