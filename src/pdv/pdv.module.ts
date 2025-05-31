import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PDVSchema, PDVSchemaFactory } from './schemas/pdv.schema';
import { PDVController } from './pdv.controller';
import { PDVService } from './pdv.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PDVSchema.name, schema: PDVSchemaFactory },
    ]),
    ProductModule,
  ],
  controllers: [PDVController],
  providers: [PDVService],
  exports: [PDVService],
})
export class PDVModule {}
