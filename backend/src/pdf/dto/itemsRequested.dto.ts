import {IsBoolean, IsOptional} from "class-validator";

export class ItemsRequestedDto {
  @IsOptional() @IsBoolean() licensePlates?: boolean;
  @IsOptional() @IsBoolean() registrationCard?: boolean;
  @IsOptional() @IsBoolean() licenseYearSticker?: boolean;
  @IsOptional() @IsBoolean() licenseMonthSticker?: boolean;
  @IsOptional() @IsBoolean() vesselYearSticker?: boolean;
  @IsOptional() @IsBoolean() vesselCertificate?: boolean;
  @IsOptional() @IsBoolean() vesselMusselFee?: boolean;
  @IsOptional() @IsBoolean() dpPlacard?: boolean;
  @IsOptional() @IsBoolean() dpIdCard?: boolean;
  @IsOptional() @IsBoolean() pnoCard?: boolean;
  @IsOptional() @IsBoolean() pfrSticker?: boolean;
  @IsOptional() @IsBoolean() cvraWeightDecal?: boolean;
  @IsOptional() @IsBoolean() cvraYearSticker?: boolean;
  @IsOptional() @IsBoolean() trailerOhvIdCard?: boolean;
}