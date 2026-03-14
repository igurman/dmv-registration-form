import { IsOptional, IsString, Max, MaxLength } from "class-validator";

export class OwnerDto {
  @MaxLength(80)
  fullName?: string;

  @IsOptional()
  @MaxLength(8)
  dlNumber?: string;

  @IsOptional()
  @MaxLength(80)
  coOwnerName?: string;

  @IsOptional()
  @MaxLength(8)
  dl2Number?: string;

  @IsOptional()
  @MaxLength(48)
  physicalAddress?: string;

  @IsOptional()
  @MaxLength(10)
  apt?: string;

  @IsOptional()
  @MaxLength(30)
  city?: string;

  @IsOptional()
  @MaxLength(2)
  state?: string;

  @IsOptional()
  @Max(99999)
  zipCode?: number;

  @IsOptional()
  @MaxLength(200)
  county?: string;

  @IsOptional() // IF DIFFERENT FROM PHYSICAL ABOVE
  @MaxLength(200)
  mailingAddress?: string;

  @IsOptional()
  @MaxLength(10)
  mailingApt?: string;

  @IsOptional()
  @MaxLength(30)
  mailingCity?: string;

  @IsOptional()
  @MaxLength(2)
  mailingState?: string;

  @IsOptional()
  @Max(99999)
  mailingZipCode?: number;
}