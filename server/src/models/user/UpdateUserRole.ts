import { IsEnum } from "class-validator";
import { UserRole } from "./UserRole";

export class UpdateUserRole {
    @IsEnum(UserRole)
    public role!: UserRole;
}