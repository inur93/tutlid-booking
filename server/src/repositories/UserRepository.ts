import Model, { UserDoc } from "../models/user/User";
import { BaseRepository, IBaseRepository } from "./BaseRepository";


export interface IUserRepository extends IBaseRepository<UserDoc> {

}

export default class UserRepository extends BaseRepository<UserDoc> implements IUserRepository {
    constructor() {
        super(Model)
    }
}
