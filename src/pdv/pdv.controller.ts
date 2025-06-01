import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
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
    console.log('addProductDto', addProductDto);
    return this.pdvService.addItemById(id, 'products', {
      productId: addProductDto.productId,
      quantity: addProductDto.quantity,
      discount: addProductDto.discount ?? 0,
    } as any);
  }

  @Get()
  async findAll() {
    return this.pdvService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.pdvService.findById(id, 'products.productId');

    if (!res) {
      throw new NotFoundException(`Not found PDV: ${id}`);
    }

    return res;
  }

  @Patch(':id')
  @ApiBody({ type: PDVDto })
  async update(@Param('id') id: string, @Body() updatePDVDto: PDVDto) {
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
}
