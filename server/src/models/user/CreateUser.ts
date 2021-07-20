import { IsString } from "class-validator";
import { User } from "./User";

export class CreateUser implements Pick<User, 'fullName' | 'email' | 'password'> {
    @IsString()
    public fullName!: string;

    @IsString()
    public email!: string;

    @IsString()
    public password!: string;

}