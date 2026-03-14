import {IsDefined, IsNotEmptyObject, IsObject, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CertificationDto} from "@/pdf/dto/certification.dto";
import {ReasonDto} from "@/pdf/dto/reason.dto";
import {ItemsRequestedDto} from "@/pdf/dto/itemsRequested.dto";
import {OwnerDto} from "@/pdf/dto/owner.dto";
import {VehicleDto} from "@/pdf/dto/vehicle.dto";

export class FormDto {

  // Vehicle Info
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => VehicleDto)
  vehicle!: VehicleDto;

  // SECTION 1 — REGISTERED OWNER OF RECORD
  @IsDefined({ message: 'Поле obj должно быть заполнено' })
  @IsNotEmptyObject({}, { message: 'Поле obj должно быть заполнено' })
  @ValidateNested()
  @Type(() => OwnerDto)
  owner!: OwnerDto;

  // SECTION 2 — PLATES, STICKERS, DOCUMENTS REQUEST
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => ItemsRequestedDto)
  itemsRequested!: ItemsRequestedDto;

  // SECTION 3 — THE ITEM REQUESTED WAS
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => ReasonDto)
  reason!: ReasonDto;

  // SECTION 5 — CERTIFICATION
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => CertificationDto)
  certification!: CertificationDto;
}