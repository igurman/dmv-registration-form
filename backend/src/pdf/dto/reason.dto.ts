import {IsBoolean, IsOptional, IsString, MaxLength} from "class-validator";

export class ReasonDto {
  @IsOptional() @IsBoolean() lost?: boolean;
  @IsOptional() @IsBoolean() stolen?: boolean;
  @IsOptional() @IsBoolean() destroyed?: boolean;
  @IsOptional() @IsBoolean() notReceivedFromDmv?: boolean;
  @IsOptional() @IsBoolean() notReceivedFromPriorOwner?: boolean;
  @IsOptional() @IsBoolean() surrendered?: boolean;
  @IsOptional() @IsBoolean() surrenderedOne?: boolean;
  @IsOptional() @IsBoolean() surrenderedTwo?: boolean;
  @IsOptional() @IsBoolean() specialPlatesRetained?: boolean;
  @IsOptional() @IsBoolean() regCardCurrentAddress?: boolean;
  @IsOptional() @IsBoolean() cvcSection?: boolean;
  @IsOptional() @IsBoolean() other?: boolean;
  @IsOptional() @IsBoolean() oneLicensePlate?: boolean;
  @IsOptional() @IsBoolean() twoLicensePlates?: boolean;

  @IsOptional()
  @MaxLength(500)
  explanation?: string;
}
