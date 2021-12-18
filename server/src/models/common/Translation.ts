import { IsNotEmpty, Length } from "class-validator";
import { Schema } from "mongoose";

export class Translation {
    
    @Length(2, 2)
    language!: string
    @IsNotEmpty()
    content!: string
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