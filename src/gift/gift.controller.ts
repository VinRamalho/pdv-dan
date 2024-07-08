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
  UnauthorizedException,
} from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftDto } from './dto/gift.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';

@Controller('gift')
export class GiftController {
  constructor(
    private readonly giftService: GiftService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createGiftDto: GiftDto, @Request() req) {
    try {
      const user = req.user satisfies Pick<UserDocument, '_id'>;

      const { _id } = user;

      const res = await this.giftService.create({
        ...createGiftDto,
        user: _id,
      });

      await this.userService.addItemById(_id, 'gifts', res._id);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  async findAll(@Request() req) {
    const user = req.user satisfies Pick<UserDocument, '_id'>;

    const { _id: id } = user;

    try {
      const res = await this.giftService.findByUserId(id);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  async find(@Param('id') id: string, @Request() req) {
    const user = req.user satisfies Pick<UserDocument, '_id'>;

    const { _id: userId } = user;

    try {
      const res = await this.giftService.findById(id);

      if (!res) {
        throw new NotFoundException(`Not found Gift: ${id}`);
      }
      const userGift = res.user as UserDocument;

      if (String(userGift._id) !== userId) {
        throw new UnauthorizedException('Oops! you are not allowed to do this');
      }

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGiftDto: GiftDto) {
    try {
      const res = await this.giftService.update(id, updateGiftDto);
      if (!res) {
        throw new NotFoundException(`Not found Gift: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const user = req.user satisfies Pick<
        UserDocument,
        'email' | 'name' | '_id'
      >;

      const { _id } = user;

      const res = await this.giftService.delete(id);

      await this.userService.removeItemById(_id, 'gifts', id);

      if (!res) {
        throw new NotFoundException(`Not found Gift: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
