import { Document, DocumentDefinition, EnforceDocument, FilterQuery, Model, QueryOptions, Types } from "mongoose";
import { applyPatch, Operation, validate } from 'fast-json-patch';
import NotFoundException from "../exceptions/NotFoundException";

export interface IBaseRepository<T extends Document> {
    create(doc: T | DocumentDefinition<T>): Promise<T>
    find(query: FilterQuery<T>, options?: QueryOptions): Promise<EnforceDocument<T, {}>[]>
    findById(id: Types.ObjectId): Promise<EnforceDocument<T, {}>>
    findOne(query: FilterQuery<T>): Promise<EnforceDocument<T, {}> | null>
    patch(id: Types.ObjectId, ops: Operation[]): Promise<EnforceDocument<T, {}>>
    delete(id: Types.ObjectId): Promise<void>
}

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }
    create(doc: T | DocumentDefinition<T>): Promise<T> {
        return this.model.create(doc);
    }
    async find(query: FilterQuery<T>, options?: QueryOptions): Promise<EnforceDocument<T, {}>[]> {
        return await this.model.find(query, undefined, options);
    }
    async findById(id: Types.ObjectId): Promise<EnforceDocument<T, {}>> {
        const res = await this.model.findById(id);
        if (!res) throw new NotFoundException(`Record with id ${id} does not exist`);
        return res;
    }
    async findOne(query: FilterQuery<T>): Promise<EnforceDocument<T, {}> | null> {
        return await this.model.findOne(query);
    }
    async patch(id: Types.ObjectId, ops: Operation[]): Promise<EnforceDocument<T, {}>> {
        const doc = await this.model.findById(id);
        if (!doc) throw new NotFoundException(`Record with id ${id} does not exist`);
        const errors = validate(ops, doc);
        console.log('patch error', {doc, errors});
        const updated = applyPatch(doc, ops, true).newDocument;
        updated.save();
        return updated;
    }
    async delete(id: Types.ObjectId): Promise<void> {
        await this.model.deleteOne({ _id: id }).exec();
    }

}