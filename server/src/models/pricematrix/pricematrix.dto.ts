import { IsDateString, IsPositive } from 'class-validator';

export class CreatePriceMatrix {
    @IsDateString()
    public validFrom!: Date;

    @IsPositive()
    public price!: number;

    @IsPositive()
    public tubPrice!: number;
}
