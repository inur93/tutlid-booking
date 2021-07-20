import { Document, Model, model, models, Schema, Types } from "mongoose";
import { User } from "../user/User";
import { Translation, TranslationSchema } from "../common/Translation";

export interface Group {
    _id: Types.ObjectId,
    name: Translation[],
    users: Types.ObjectId[] | User[]
}

const GroupSchemaFields: Record<keyof Omit<Group, '_id'>, any> = {
    name: {
        type: [TranslationSchema],
        required: true
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }
}

export const GroupSchema = new Schema(GroupSchemaFields);
export interface GroupDoc extends Omit<Group, '_id'>, Document { }
export const GroupModel: Model<GroupDoc> = models.Group || model<GroupDoc>('Group', GroupSchema);
