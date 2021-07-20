
import { IsString } from 'class-validator';

export class Login {
    @IsString()
    public email!: string;

    @IsString()
    public password!: string;
}
