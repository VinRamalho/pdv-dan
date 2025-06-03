import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  StreamableFile,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PDVService } from './pdv.service';
import { PDVDto, CreatePDVDto, AddProductDto } from './dto/pdv.dto';

@ApiTags('pdv')
@Controller('pdv')
export class PDVController {
  constructor(private readonly pdvService: PDVService) {}

  @Post()
  async create(@Body() createPDVDto: CreatePDVDto) {
    const sequence = await this.pdvService.generateSequence();

    return this.pdvService.create({
      ...createPDVDto,
      sequence,
    });
  }

  @Post(':id/product')
  async addProduct(
    @Param('id') id: string,
    @Body() addProductDto: AddProductDto,
  ) {
    return this.pdvService.updateProduct(
      id,
      addProductDto.productId,
      addProductDto.quantity,
      addProductDto.discount ?? 0,
    );
  }

  @Delete(':id/product/:productId')
  async removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.pdvService.removeProduct(id, productId);
  }

  @Get()
  async findAll() {
    return this.pdvService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.pdvService.findById(id, 'products.product');

    if (!res) {
      throw new NotFoundException(`Not found PDV: ${id}`);
    }

    return res;
  }

  @Put(':id')
  @ApiBody({ type: PDVDto })
  async update(@Param('id') id: string, @Body() updatePDVDto: CreatePDVDto) {
    const res = await this.pdvService.update(id, updatePDVDto);

    if (!res) {
      throw new NotFoundException(`Not found PDV: ${id}`);
    }

    return res;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.pdvService.delete(id);

    if (!res) {
      throw new NotFoundException(`Not found PDV: ${id}`);
    }

    return res;
  }

  @Post(':id/attachment')
  async addAttachment(@Param('id') id: string) {
    const pdv = await this.pdvService.findById(id, 'products.product');

    if (!pdv) {
      throw new NotFoundException(`Not found PDV: ${id}`);
    }

    const buffer = await this.pdvService.getAttachment(pdv);

    return new StreamableFile(buffer, {
      disposition: `attachment; filename=recibo-os-${pdv.sequence}.pdf`,
      type: 'application/pdf',
    });
  }
}
