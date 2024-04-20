import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailDto } from './dto/mail.dto';
import { UserService } from 'src/users/user.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Processor()
export class QueueMailConsumer {
  constructor(private userService: UserService) {}

  @Process(MailDto.SEND)
  async send(job: Job<UserDocument>) {
    const { _id, name } = job.data;
    await this.userService.set(_id, { name: `${name}-upd-by-queue` });
  }
}
