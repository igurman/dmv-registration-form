import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    PdfModule
  ],
})
export class AppModule {}
