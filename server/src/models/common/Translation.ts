import { Schema } from "mongoose";

export interface Translation {
    language: string,
    content: string
}

const TranslationSchemaFields: Record<keyof Translation, any> = {
    language: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}

export const TranslationSchema = new Schema(TranslationSchemaFields);