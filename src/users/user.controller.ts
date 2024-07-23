import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserDocument } from './schemas/user.schema';
import { QueueMailService } from 'src/queue/mail/mail.producer.service';
import { Public } from 'src/auth/constants/constants';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly queueMailService: QueueMailService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: UserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  @ApiBearerAuth('Authorization')
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  async find(@Param('id') id: string) {
    try {
      const res = await this.userService.findById(id);
      if (!res) {
        throw new NotFoundException(`Not found User: ${id}`);
      }
      await this.queueMailService.send(res);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  async update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    try {
      throw new ForbiddenException('You are not allowed to do this');
      const res = await this.userService.update(id, updateUserDto);
      if (!res) {
        throw new NotFoundException(`Not found User: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.userService.delete(id);

      if (!res) {
        throw new NotFoundException(`Not found User: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
