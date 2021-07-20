import { IsEmail } from "class-validator";

export class ResetUserPassword {
    @IsEmail()
    public email!: string
}