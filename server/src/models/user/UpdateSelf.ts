import { IsOptional, IsString } from "class-validator";
import { User } from "./User";

export class UpdateSelf implements Partial<Pick<User, 'fullName'>> {
    @IsString() @IsOptional()
    public fullName?: string;
}