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
import { GiftDto, PayCartReqGiftDto, PayReqGiftDto } from './dto/gift.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';


@Controller('gift')
export class GiftController {
  constructor(
    private readonly giftService: GiftService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiBearerAuth("Authorization")
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
  @ApiBearerAuth("Authorization")
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
  @ApiBearerAuth("Authorization")
  async find(@Param('id') id: string, @Request() req) {
    const user = req.user satisfies Pick<UserDocument, '_id'>;

    const { _id: userId } = user;

    try {
      const res = await this.giftService.findById(id);

      if (!res) {
        throw new NotFoundException(`Not found Gift: ${id}`);
      }
      const userGift = res.user ;

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
  @ApiBearerAuth("Authorization")
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
  @ApiBearerAuth("Authorization")
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const user = req.user satisfies Pick<
        UserDocument,
        'email' | 'name' | '_id'
      >;

      const { _id } = user;

      const res = await this.giftService.delete(id);

      if (!res) {
        throw new NotFoundException(`Not found Gift: ${id}`);
      }

      await this.userService.removeItemById(_id, 'gifts', id);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Post('/payment/cart')
  @ApiBody({ type: PayCartReqGiftDto })
  @ApiBearerAuth("Authorization")
  async paymentCart(@Request() req, @Body() { ids = [] }: PayCartReqGiftDto) {
    const user = req.user satisfies Pick<
      UserDocument,
      'email' | 'name' | '_id'
    >;

    const { _id: userId } = user;
    

    try {
      const res = this.giftService.processCartPayment(ids, userId);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Post('/payment/:id')
  @ApiBody({ type: PayReqGiftDto })
  @ApiBearerAuth("Authorization")
  async payment(@Param('id') id: string, @Request() req, @Body() { quantity = 1 }: PayReqGiftDto) {
    const user = req.user satisfies Pick<
      UserDocument,
      'email' | 'name' | '_id'
    >;
    const { _id: userId } = user;

    try {
      const res = this.giftService.processPayment(id, userId, quantity);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
