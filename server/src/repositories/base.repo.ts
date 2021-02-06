import { Model, Types } from "mongoose";
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { DocumentType } from "@typegoose/typegoose";


type BaseUpdate = {
    _id: Types.ObjectId
}

export interface IBaseRepository<T extends Base, C, U extends BaseUpdate> {
    findById(id: Types.ObjectId): Promise<T>
    delete(id: Types.ObjectId): Promise<void>
    create(entity: C): Promise<T>
    update(entity: U): Promise<T>
}

export abstract class BaseRepository<T extends Base, C, U extends BaseUpdate> implements IBaseRepository<T, C, U> {

    private readonly model: Model<DocumentType<T>>;
    constructor(model: Model<DocumentType<T>>) {
        this.model = model;
    }
    async findById(id: Types.ObjectId): Promise<T> {
        return this.model.findById(id);
    }
    async delete(id: Types.ObjectId): Promise<void> {
        this.model.deleteOne({
            _id: id
        });
    }
    async create(entity: C): Promise<T> {
        return this.model.create(entity);
    }
    async update({ _id, ...update }: U): Promise<T> {
        return this.model
            .findById(_id, update)
            .exec();
    }
}
