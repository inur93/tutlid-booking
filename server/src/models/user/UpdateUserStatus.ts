import { IsEnum } from "class-validator";
import { User } from "./User";
import { UserStatus } from "./UserStatus";

export class UpdateUserStatus implements Partial<Pick<User, 'status'>> {
    @IsEnum(UserStatus)
    public status!: UserStatus;
}