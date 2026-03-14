import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {PDFDocument} from 'pdf-lib';
import * as fs from 'fs';
import {FormDto} from "@/pdf/dto/form.dto";
import {ConfigService} from "@nestjs/config";
import {join} from 'path';
import { format } from 'date-fns';
import * as console from "node:console";

const formatDate = (value?: Date) => value ? format(value, 'MM/dd/yyyy') : undefined;

@Injectable()
export class PdfService {
  constructor(private configService: ConfigService) {}

  public async processForm(formDto: FormDto): Promise<Uint8Array> {
    const pdfDoc = await this.getPdfTemplate(this.getTemplatePath('TEMPLATE_PATH'));
    const form = pdfDoc.getForm();

    const setText = (fieldName: string, value?: string) => {
      if (!value) return;
      try {
        form.getTextField(fieldName).setText(value);
      } catch (error: any) {
        console.log(`[PDF Service] Can't save field: ${fieldName}, value: ${value}, error: ${error}`);
      }
    };

    const setCheck = (fieldName: string, value?: boolean) => {
      try {
        const cb = form.getCheckBox(fieldName);
        value ? cb.check() : cb.uncheck();
      } catch {
        console.log(`[PDF Service] Can't save check: ${fieldName}, value: ${value}`);
      }
    };

    const {vehicle: v, owner: o, itemsRequested: i, reason: r, certification: c} = formDto;

    // Vehicle Info
    setText('Vehicle license plate', v.licensePlate);
    setText('Make', v.make);
    setText('VIN', v.vin);
    setText('DP number', v.dpPlacardNumber);
    setText('Birth date', formatDate(v.birthDate));
    setText('Engine number', v.engineNumber);

    // Owner Info (Section 1)
    setText('True full name', o.fullName);
    setText('DL1', o.dlNumber);
    setText('Co owner', o.coOwnerName);
    setText('2DL1', o.dl2Number);
    setText('Physical address', o.physicalAddress);
    setText('Apt #', o.apt);
    setText('City', o.city);
    setText('state', o.state);
    setText('zip code', o.zipCode?.toString());
    setText('County', o.county);
    setText('Mailing address', o.mailingAddress);
    setText('Apt 2', o.mailingApt);
    setText('City2', o.mailingCity);
    setText('state2', o.mailingState);
    setText('zip code2', o.mailingZipCode?.toString());

    // Items Requested (Section 2)
    setCheck('License plates', i.licensePlates);
    setCheck('Reg Card', i.registrationCard);
    setCheck('license year', i.licenseYearSticker);
    setCheck('license month', i.licenseMonthSticker);
    setCheck('vessel year', i.vesselYearSticker);
    setCheck('vessel cert', i.vesselCertificate);
    setCheck('mussel', i.vesselMusselFee);
    setCheck('DP Placard', i.dpPlacard);
    setCheck('DP ID card', i.dpIdCard);
    setCheck('PNO', i.pnoCard);
    setCheck('PFR', i.pfrSticker);
    setCheck('CVRA weight', i.cvraWeightDecal);
    setCheck('CVRA year', i.cvraYearSticker);
    setCheck('Trailer/OHV ID', i.trailerOhvIdCard);

    // Reason (Section 3)
    setCheck('Lost', r.lost);
    setCheck('Stolen', r.stolen);
    setCheck('destroyed', r.destroyed);
    setCheck('Not Received DMV', r.notReceivedFromDmv);
    setCheck('Not received prior owner', r.notReceivedFromPriorOwner);
    setCheck('Surrendered', r.surrendered);
    setCheck('one', r.surrenderedOne);
    setCheck('Two', r.surrenderedTwo);
    setCheck('Special plates', r.specialPlatesRetained);
    setCheck('REG card with current address', r.regCardCurrentAddress);
    setCheck('CVC', r.cvcSection);
    setCheck('other', r.other);
    setCheck('One license', r.oneLicensePlate);
    setCheck('Two plates', r.twoLicensePlates);
    setText('Explanation', r.explanation);

    // Certification (Section 5)
    setText('certification', c.printName);
    setText('title', c.title);
    setText('area code', c.areaCode?.toString());
    setText('telephone number', c.telephoneNumber);
    setText('date.0', formatDate(c.date));
    setText('date.1', c.email);

    return pdfDoc.save();
  }

  private async getPdfTemplate(path: any): Promise<PDFDocument> {
    return await PDFDocument.load(path, {ignoreEncryption: true, updateMetadata: false});
  }

  private getTemplatePath(name: string){
    try {
      const templatePath = this.configService.get(name);
      return fs.readFileSync(join(__dirname, templatePath));
    } catch {
      throw new InternalServerErrorException('PDF template not found');
    }
  }
}
