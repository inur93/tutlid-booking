import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserStatus } from './user.entity';

export class CreateUserDto {
    @IsString()
    public fullName: string;

    @IsString()
    public email: string;

    @IsString()
    public password: string;

}
export class UpdateSelfDto {
    @IsString() @IsOptional()
    public fullName?: string;
}
export class UpdateUserDto extends UpdateSelfDto {
    
    public id: Types.ObjectId;
    @IsEnum(UserStatus) @IsOptional()
    public status: UserStatus;
}