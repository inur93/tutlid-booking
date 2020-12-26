import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateUserDto {
    @IsString()
    public fullName: string;

    @IsString()
    public email: string;

    @IsString()
    public password: string;

}
export class UpdateSelfDto {
    @IsString()
    public fullName: string;
}
export class UpdateUserDto extends UpdateSelfDto {
    
    public id: ObjectId;
}