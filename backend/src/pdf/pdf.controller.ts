import { Body, Controller, Post, Res, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { FormDto } from "@/pdf/dto/form.dto";
import { ApiOkResponse, ApiOperation, ApiProduces } from "@nestjs/swagger";

@Controller('/api/v1')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('/form')
  @HttpCode(200)
  @ApiProduces('application/pdf')
  @ApiOkResponse({schema: {type: 'string', format: 'binary',}})
  @ApiOperation({summary: 'Build PDF form'})
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true}))
  async registration(@Body() dto: FormDto, @Res() res: Response) {

    const pdfBuffer = await this.pdfService.processForm(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="REG-156-filled.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(Buffer.from(pdfBuffer));
  }
}
