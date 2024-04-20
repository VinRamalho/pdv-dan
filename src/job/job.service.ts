import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { JobDocument, JobSchema } from './schemas/job.schema';
import { Crud } from 'src/crud/crud.abstract';

@Injectable()
export class JobService extends Crud<JobSchema> {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobService: Model<JobSchema>,
  ) {
    super(jobService);
  }

  async findById(
    id: string,
  ): Promise<HydratedDocument<JobDocument> | undefined> {
    const res = await super.findById(id, 'user');

    return res;
  }

  async findAll(): Promise<HydratedDocument<JobDocument>[] | undefined> {
    const res = await super.findAll('user', ['name', 'email']);

    return res;
  }
}
