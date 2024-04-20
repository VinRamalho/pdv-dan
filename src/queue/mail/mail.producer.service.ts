import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueDto } from '../dto/queue.dto';
import { Queue } from 'bull';
import { MailDto } from './dto/mail.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class QueueMailService {
  constructor(@InjectQueue(QueueDto.SEND_EMAIL) private queue: Queue) {}

  async send(user: UserDocument) {
    await this.queue.add(MailDto.SEND, user);
  }
}
