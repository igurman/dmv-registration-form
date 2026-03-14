import {IsDate, IsOptional, IsString, MaxLength} from "class-validator";
import {Transform} from "class-transformer";

export class VehicleDto {

  @MaxLength(8)
  licensePlate!: string;

  @MaxLength(23)
  make!: string;

  @MaxLength(17)
  vin!: string;

  @IsOptional() // DISABLED PERSON PLACARD NUMBER
  @MaxLength(30)
  dpPlacardNumber?: string;

  @IsOptional() // IF DP PLACARD
  @IsDate()
  @Transform(({ value }) => {
    const [year, month, day] = value.split('-');
    return new Date(`${year}-${month}-${day}`);
  })
  birthDate?: Date;

  @IsOptional() // MOTORCYCLES ONLY
  @MaxLength(54)
  engineNumber?: string;
}