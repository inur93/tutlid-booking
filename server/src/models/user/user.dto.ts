import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from './user.entity';

export class CreateUserDto {
    @IsString()
    public fullName!: string;

    @IsString()
    public email!: string;

    @IsString()
    public password!: string;

}
export class UpdateSelfDto {
    @IsString() @IsOptional()
    public fullName?: string;
}

export class UpdateUserStatusDto {
    @IsEnum(UserStatus)
    public status!: UserStatus;
}

export class UpdateUserRoleDto {
    @IsEnum(UserRole)
    public role!: UserRole;
}