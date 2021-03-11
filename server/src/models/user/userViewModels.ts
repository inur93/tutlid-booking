import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsJWT } from 'class-validator';
import { User, UserRole, UserStatus } from './UserModels';
export class CreateUserDto implements Pick<User, 'fullName' | 'email' | 'password'> {
    @IsString()
    public fullName!: string;

    @IsString()
    public email!: string;

    @IsString()
    public password!: string;

}
export class UpdateSelfDto implements Partial<Pick<User, 'fullName'>> {
    @IsString() @IsOptional()
    public fullName?: string;
}

export class UpdateUserStatusDto implements Pick<User, 'status'> {
    @IsEnum(UserStatus)
    public status!: UserStatus;
}

export class UpdateUserRoleDto {
    @IsEnum(UserRole)
    public role!: UserRole;
}

export class ResetPasswordDto {
    @IsEmail()
    public email!: string
}

export class UpdatePasswordDto {
    @MinLength(6)
    public password!: string
    @IsJWT()
    public token!: string
}