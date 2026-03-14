import {IsDate, IsEmail, IsOptional, IsString, Max, MaxLength} from "class-validator";
import {Transform} from "class-transformer";

export class CertificationDto {
  @IsOptional()
  @MaxLength(35)
  printName?: string;

  @IsOptional()
  @MaxLength(40)
  title?: string;

  @Max(999)
  areaCode?: number;

  @MaxLength(12)
  telephoneNumber?: string;

  @IsDate()
  @Transform(({ value }) => {
    const [year, month, day] = value.split('-');
    return new Date(`${year}-${month}-${day}`);
  })
  date?: Date;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;
}