import { Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';
import { PDVDocument, PDVSchema } from './schemas/pdv.schema';
import { ProductService } from 'src/product/product.service';
import { Crud } from 'src/crud/crud.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { AttachmentService } from 'src/attachment/attachment.service';

@Injectable()
export class PDVService extends Crud<PDVSchema> {
  constructor(
    @InjectModel(PDVSchema.name)
    private readonly pdvModel: Model<PDVSchema>,
    private readonly productService: ProductService,
    private readonly attachmentService: AttachmentService,
  ) {
    super(pdvModel);
  }

  async generateSequence(): Promise<string> {
    const res = await this.pdvModel
      .find()
      .sort({ sequence: -1 })
      .limit(1)
      .exec();
    const lastSequence = res[0]?.sequence ?? '2555000000';
    const nextNumber = parseInt(lastSequence) + 1;
    return nextNumber.toString().padStart(10, '2555000000');
  }

  async findAll(): Promise<HydratedDocument<PDVDocument>[]> {
    const res = await this.pdvModel
      .find()
      .sort({ createdAt: -1 })
      .populate('products.product')
      .exec();

    return res ?? [];
  }

  async getAttachment(pdv: PDVDocument) {
    const data = await this.attachmentService.generateOsReceiptPdf(pdv);

    return data;
  }

  async updateProduct(
    id: string,
    productId: string,
    quantity: number,
    discount: number,
  ) {
    const pdv = await this.findById(id);
    if (!pdv) {
      return undefined;
    }

    const productIndex = pdv.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex === -1) {
      return this.addItemById(id, 'products', {
        product: productId,
        quantity,
        discount,
      } as any);
    }

    return this.updateItemById(
      id,
      'products',
      {
        product: productId,
        quantity,
        discount,
      } as any,
      { 'products.product': productId },
    );
  }

  async removeProduct(id: string, productId: string) {
    return this.removeItemById(id, 'products', { product: productId } as any);
  }
}
