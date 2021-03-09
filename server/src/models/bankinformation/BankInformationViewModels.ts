import { IsString, Length } from "class-validator";


export class UpdateBankInformation {
    @IsString()
    @Length(4)
    public regNo!: string;
    @IsString()
    @Length(10)
    public accountNo!: string;
}
