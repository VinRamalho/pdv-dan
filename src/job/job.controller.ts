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
import { JobService } from './job.service';
import { JobDto } from './dto/job.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createJobDto: JobDto, @Request() req) {
    try {
      const user = req.user satisfies Pick<
        UserDocument,
        'email' | 'name' | '_id'
      >;

      const { _id } = user;

      const res = await this.jobService.create({
        ...createJobDto,
        user: _id,
      });

      await this.userService.addItemById(_id, 'jobs', res._id);

      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.jobService.findAll();
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    try {
      const res = await this.jobService.findById(id);
      if (!res) {
        throw new NotFoundException(`Not found Job: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: JobDto) {
    try {
      const res = await this.jobService.update(id, updateJobDto);
      if (!res) {
        throw new NotFoundException(`Not found Job: ${id}`);
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

      const res = await this.jobService.delete(id);

      await this.userService.removeItemById(_id, 'jobs', id);

      if (!res) {
        throw new NotFoundException(`Not found Job: ${id}`);
      }
      return res;
    } catch (err: any) {
      console.error('ERR', err);
      throw err;
    }
  }
}
