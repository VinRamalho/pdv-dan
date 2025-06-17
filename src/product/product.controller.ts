import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: ProductDto) {
    try {
      const res = await this.productService.create(createProductDto);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  async findAll() {
    try {
      const res = await this.productService.findAll();

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    try {
      const res = await this.productService.findById(id);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: ProductDto) {
    try {
      const res = await this.productService.update(id, updateProductDto);
      if (!res) {
        throw new NotFoundException(`Not found Product: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.productService.delete(id);

      if (!res) {
        throw new NotFoundException(`Not found Product: ${id}`);
      }

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Post('mark-all-obsolete')
  async markAllAsObsolete() {
    try {
      const result = await this.productService.markAllAsObsolete();
      return result;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
