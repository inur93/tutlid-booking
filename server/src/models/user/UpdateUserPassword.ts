import { IsJWT, MinLength } from "class-validator"

export class UpdateUserPassword {
    @MinLength(6)
    public password!: string
    @IsJWT()
    public token!: string
}